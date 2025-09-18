// // controllers/llmController.js
// const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
// const { HumanMessage } = require("@langchain/core/messages");
// const { RetrievalQAChain } = require("langchain/chains");

// // import your retrievers initialised at startup
// const { symptomsRetriever, sosRetriever } = require("../retrievers");

// // your Google API key from env
// const apiKey = process.env.GOOGLE_API_KEY;

// const baseModel = new ChatGoogleGenerativeAI({
//   model: "gemini-1.5-flash",
//   apiKey,
// });

// // --- classify ---
// const classifyQuery = async (query) => {
//   const prompt = `
//   Classify the following user query strictly into one of:
//   - Symptoms
//   - SOS
//   - Data Entry
//   - Symptoms+Data Entry
//   - SOS+Data Entry

//   Query: "${query}"

//   Output only the category.
//   `;
//   const res = await baseModel.invoke([
//     new HumanMessage({ content: [{ type: "text", text: prompt }] }),
//   ]);
//   return res.content[0].text.trim();
// };

// // --- build chain ---
// const buildChain = (retriever) =>
//   RetrievalQAChain.fromLLM(baseModel, retriever);

// // --- controller handler ---
// exports.handleUserQuery = async (req, res) => {
//   const { query } = req.body;
//   const userId = req.user?.id; // or however you identify the user

//   if (!query) {
//     return res.status(400).json({ error: "Missing query" });
//   }

//   try {
//     // 1. classify
//     const classification = await classifyQuery(query);

//     // 2. optionally extract/store user data here if classification.includes('Data Entry')
//     if (classification.includes("Data Entry")) {
//       // TODO: call your extractAndStoreUserData(userId, query)
//     }

//     // 3. route to appropriate retriever
//     let answer = "✅ Data saved successfully.";
//     if (classification.includes("Symptoms")) {
//       const chain = buildChain(symptomsRetriever);
//       answer = (await chain.call({ query })).text;
//     }

//     if (classification.includes("SOS")) {
//       const chain = buildChain(sosRetriever);
//       answer = (await chain.call({ query })).text;
//     }

//     res.json({ classification, answer });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };







// controllers/llmController.js
// require("dotenv").config();
// const fs = require("fs");
// const csv = require('csv-parse')
// const parse = require("csv-parse/sync");
// const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
// const { HumanMessage } = require("@langchain/core/messages");
// const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

// // ---------- 1. Load CSV knowledge base ----------
// const filePath = 'D:\\hackaphasia\\Hackaphasia\\Backend\\controllers\\medical_knowledge.csv'
// // const csvData = fs.readFileSync(filePath, 'utf8'); // adjust path
// // const records = parse(csvData, { columns: true });


// function parseCSV(filePath) {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const rows = data.split('\n');  // Split the file into rows by newlines
//     const headers = rows[0].split(',');  // Split the first row into headers
    
//     // Parse the rest of the rows
//     const result = rows.slice(1).map(row => {
//         const values = row.split(',');
//         let rowObject = {};
        
//         values.forEach((value, index) => {
//             rowObject[headers[index]] = value.trim();
//         });
        
//         return rowObject;
//     });

//     return result;
// }

// const records = parseCSV(filePath);

// // ---------- 2. Precompute embeddings once ----------
// const embedder = new GoogleGenerativeAIEmbeddings({
//   apiKey: process.env.GOOGLE_API_KEY,
//   model: "models/embedding-001",
// });

// let embeddedRecords = [];
// (async () => {
//   embeddedRecords = await Promise.all(
//     records.map(async (r) => {
//       const text = `${r.title} ${r.description}`; // combine columns you want
//       const vector = await embedder.embedQuery(text);
//       return { text, vector, meta: r };
//     })
//   );
// })();

// // ---------- Helper: cosine similarity ----------
// function cosineSim(a, b) {
//   const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
//   const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
//   const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
//   return dot / (normA * normB);
// }

// // ---------- 3. Classifier ----------
// async function classifyQuery(prompt) {
//   const model = new ChatGoogleGenerativeAI({
//     apiKey: process.env.GOOGLE_API_KEY,
//     model: "gemini-2.5-flash",
//   });

//   const classificationPrompt = `
// Classify the user query into one of:
// - Symptoms
// - SOS
// - Data Entry
// - Symptoms+Data Entry
// - SOS+Data Entry

// Return only the category.

// User query: """${prompt}"""`;
//   console.log("model is classifing...  ")
//   try{
//       const res = await model.invoke([new HumanMessage(classificationPrompt)]);
//       return res.content[0].text.trim();
//   }catch(err){
//     console.log("error while classifing:",err)
//   }
// }

// // ---------- 4. Retrieval ----------
// async function retrieveRelevantDoc(userQuery) {
//   const qVec = await embedder.embedQuery(userQuery);
//   let best = null;
//   let bestScore = -1;
//   for (const doc of embeddedRecords) {
//     const sim = cosineSim(qVec, doc.vector);
//     if (sim > bestScore) {
//       bestScore = sim;
//       best = doc;
//     }
//   }
//   return best;
// }

// // ---------- 5. RAG answer ----------
// async function runRAG(userQuery, doc, mode) {
//   const model = new ChatGoogleGenerativeAI({
//     apiKey: process.env.GOOGLE_API_KEY,
//     model: "gemini-1.5-flash",
//   });

//   const prompt = `
// You are a ${mode} health assistant for refugees.
// Use the following context to answer user query briefly:

// Context:
// ${doc ? doc.text : "No relevant context found."}

// User query: ${userQuery}
// Answer:`;

//   const res = await model.invoke([new HumanMessage(prompt)]);
//   return res.content[0].text;
// }

// // ---------- 6. Express Controller ----------
// exports.handleHealthQuery = async (req, res) => {
//   try {
//     const { prompt, userId } = req.body;

//     console.log("Received prompt:", prompt);
//     console.log("User ID:", userId);

//     // 1. classify
//     console.log("Classifying the query...");
//     const category = await classifyQuery(prompt);
//     console.log("Classified category:", category);

//     // 2. store user-centric data if needed
//     if (category.includes("Data Entry")) {
//       // Example: await pool.query("INSERT INTO ...", [userId, prompt]);
//       console.log("Data entry detected. Storing user data...");
//     }

//     // 3. choose model & retrieve
//     let answer = "";
//     if (category.startsWith("Symptoms")) {
//       console.log("Category is Symptoms. Retrieving relevant document...");
//       const doc = await retrieveRelevantDoc(prompt);
//       console.log("Retrieved document:", doc);
//       answer = await runRAG(prompt, doc, "Symptoms");
//       console.log("Generated answer for Symptoms:", answer);
//     } else if (category.startsWith("SOS")) {
//       console.log("Category is SOS. Retrieving relevant document...");
//       const doc = await retrieveRelevantDoc(prompt);
//       console.log("Retrieved document:", doc);
//       answer = await runRAG(prompt, doc, "SOS");
//       console.log("Generated answer for SOS:", answer);
//     } else if (category === "Data Entry") {
//       answer = "✅ Data saved.";
//       console.log("Category is Data Entry. Returning confirmation message.");
//     }

//     // 4. Return JSON response
//     console.log("Returning response...");
//     res.json({ category, answer });
//   } catch (err) {
//     console.error("Error occurred:", err);
//     res.status(500).json({ error: err.message });
//   }
// };



require("dotenv").config();

const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { HumanMessage } = require("@langchain/core/messages");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

async function genres(prompt) {
  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-flash",
  });

  const refinedPrompt = `
"You are Health Compass, a compassionate, reliable health assistant. Your goal is to provide clear, well-researched, and verified health information. Focus on general wellness, common conditions, symptoms, medications, and medical terminology.

Core Guidelines:

Explain & Justify: Provide clear, simple explanations of the reasoning behind your answers (biological, physiological, scientific).

Safety & Verification: Base your information on widely accepted medical sources. Always prioritize user safety and well-being.

Empathetic & Supportive: Respond with a caring tone, acknowledging user concerns.

No Diagnosis or Prescriptions: Do not offer diagnoses or specific medications.

Disclaimer: End every response with: 'I am an AI assistant and not a medical professional. Always consult with a healthcare provider for health concerns and give short and simple response.'"

User query: """${prompt}"""
`;

  console.log("Model is thinking...");

  try {
    const res = await model.invoke([
      new HumanMessage({
        content: refinedPrompt, // Pass the string directly here, no need for an array
      }),
    ]);
    console.log("Model Response:", JSON.stringify(res.content, null, 2));

    // Ensure res.content exists and process the result
    // const output = res.content && res.content[0]?.type === "text"
    //   ? res.content
    //   : "No recommendation found.";

    return res.content // Remove any Markdown asterisks
  } catch (err) {
    console.error("Error while invoking model:", err);
    return "Error occurred while processing your request.";
  }
}

// ---------- 6. Express Controller ----------
exports.handleHealthQuery = async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("Received prompt:", prompt);
    const answer = await genres(prompt);

    // 4. Return JSON response
    console.log("Returning response...");
    res.json({ answer });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: err.message });
  }
};
