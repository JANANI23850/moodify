# Add these imports to the existing imports in her app.py
import json, threading, time, os, uuid
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings

# Add these environment variable setups
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Add these initializations after the existing app setup
# ------------------ OpenAI Setup ------------------ #
try:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
    print("✅ OpenAI client initialized")
except Exception as e:
    print(f"❌ OpenAI error: {e}")
    openai_client = None

# ------------------ Pinecone VectorStore Setup ------------------ #
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    api_key=OPENAI_API_KEY
)

journal_index_name = "moodtunes-journal"
try:
    journal_store = PineconeVectorStore.from_existing_index(
        index_name=journal_index_name,
        embedding=embeddings
    )
    print("✅ Pinecone VectorStore connected")
except Exception as e:
    print(f"❌ Pinecone VectorStore error: {e}")
    journal_store = None

# ------------------ Journal Helper Functions ------------------ #
def save_journal_entry(entry_text, emotion, username="guest"):
    """Save a journal entry to Pinecone vector store"""
    if not journal_store:
        return None
    entry_id = f"{username}-{uuid.uuid4()}"
    metadata = {
        "username": username,
        "emotion": emotion,
        "date": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
    }
    journal_store.add_texts([entry_text], [metadata], [entry_id])
    return entry_id

def search_journal_entries(query, username="guest", top_k=5):
    """Search journal entries for context in chatbot responses"""
    if not journal_store:
        return []
    results = journal_store.similarity_search(
        query=query,
        k=top_k,
        filter={"username": username}
    )
    return [
        {
            "id": doc.metadata.get("id", ""),
            "text": doc.page_content,
            "emotion": doc.metadata.get("emotion", ""),
            "date": doc.metadata.get("date", "")
        }
        for doc in results
    ]

# ------------------ API Routes to Add ------------------ #

@app.route('/chat', methods=['POST'])
def chat():
    """Chatbot endpoint with emotion-aware responses"""
    if not openai_client:
        return jsonify({"error": "OpenAI not configured"}), 500

    try:
        data = request.get_json()
        user_message = data.get("message")
        current_user_emotion = data.get("emotion", "neutral")

        # Get relevant journal entries for context
        relevant_entries = search_journal_entries(user_message) if journal_store else []
        context = ""
        if relevant_entries:
            context = "Based on your journal: " + " ".join(
                [e["text"] for e in relevant_entries[:2]]
            )

        # Create system prompt with safety guidelines
        system_prompt = f"""
        You are MoodBot, a compassionate AI companion. The user is currently feeling {current_user_emotion}.
        {context}

        GUIDELINES (must follow):
        1. Empathy first: Keep responses short, calm, warm, and supportive.
        2. Safety rule (non-negotiable): If the user asks for self-harm, suicide methods, or any instructions to harm themselves or others, do NOT provide or describe methods, tips, or means. Instead follow the Self-Harm Response below.
        3. Self-Harm Response (template): 
        - Start with brief empathy and validation.
        - Say you cannot help with instructions to harm themselves.
        - Ask a direct question about immediate safety (e.g., "Are you safe right now?").
        - Encourage contacting emergency services or a trusted person and recommend professional help.
        - Offer supportive alternatives (listen, grounding exercises, suggest music or calming videos).
        - Keep it short and give offer to stay and talk or help find resources.
        4. Offer safe alternatives: You may suggest coping strategies (grounding, breathing, contacting a friend/family, reaching a mental health professional), recommend mood-matching music, or help find local support resources if asked.
        5. Escalation: If the user indicates imminent danger or intent to act now, clearly instruct them to contact local emergency services immediately (or local crisis lines) and encourage them to reach out to someone nearby.
        6. No judgement or moralizing. Avoid platitudes. Use simple, human language.
        7. Keep suggestions brief and actionable. Default to offering to stay in the conversation and to help locate professional help/resources.

        Keep answers concise and supportive. You may suggest music related to the user's mood, but never in lieu of urging professional help when self-harm risk is present.
        """

        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            max_tokens=150,
        )

        bot_reply = response.choices[0].message.content

        # Save long messages into journal
        if len(user_message) > 20 and journal_store:
            save_journal_entry(f"Chat: {user_message}", current_user_emotion)

        return jsonify({"reply": bot_reply})

    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/save_journal", methods=["POST"])
def save_journal():
    """Save a journal entry"""
    if not journal_store:
        return jsonify({"error": "Journal not configured"}), 500
    
    data = request.get_json()
    entry_id = save_journal_entry(
        data.get("entry"),
        data.get("emotion", "neutral"),
        data.get("username", "guest")
    )
    return jsonify({"success": True, "entry_id": entry_id})

@app.route("/get_journal_entries")
def get_journal_entries():
    """Get all journal entries for a user"""
    if not journal_store:
        return jsonify({"error": "Journal not configured"}), 500
    
    username = request.args.get("username", "guest")
    
    try:
        results = journal_store.similarity_search(
            query="journal entry", 
            k=50, 
            filter={"username": username}
        )
        
        journals = [
            {
                "id": f"{doc.metadata.get('username', 'guest')}-{hash(doc.page_content) % 10000}",
                "text": doc.page_content,
                "emotion": doc.metadata.get("emotion", ""),
                "date": doc.metadata.get("date", ""),
                "timestamp": doc.metadata.get("date", "")
            }
            for doc in results
        ]
        
        journals.sort(key=lambda x: x["date"], reverse=True)
        return jsonify({"entries": journals})
        
    except Exception as e:
        print(f"Get journal entries error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/search_journal", methods=["POST"])
def search_journal():
    """Search journal entries"""
    if not journal_store:
        return jsonify({"error": "Journal not configured"}), 500
    
    try:
        data = request.get_json()
        query = data.get("query", "")
        username = data.get("username", "guest")
        
        if not query:
            # If no query, return all entries
            results = journal_store.similarity_search(
                query="journal entry", 
                k=50, 
                filter={"username": username}
            )
        else:
            # Search with query
            results = journal_store.similarity_search(
                query=query,
                k=20,
                filter={"username": username}
            )
        
        journals = [
            {
                "id": f"{doc.metadata.get('username', 'guest')}-{hash(doc.page_content) % 10000}",
                "text": doc.page_content,
                "emotion": doc.metadata.get("emotion", ""),
                "date": doc.metadata.get("date", ""),
                "timestamp": doc.metadata.get("date", "")
            }
            for doc in results
        ]
        
        journals.sort(key=lambda x: x["date"], reverse=True)
        return jsonify({"entries": journals})
        
    except Exception as e:
        print(f"Search journal error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/delete_journal/<entry_id>", methods=["DELETE"])
def delete_journal(entry_id):
    """Delete a journal entry"""
    if not journal_store:
        return jsonify({"error": "Journal not configured"}), 500
    
    try:
        journal_store.delete(ids=[entry_id])
        return jsonify({"success": True, "message": "Journal entry deleted successfully"})
    except Exception as e:
        print(f"Delete journal error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500