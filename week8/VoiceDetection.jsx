import { useState } from "react";

const LANGUAGES = ["hindi", "tamil", "telugu", "english", "malayalam"];
const AUDIO_FORMATS = ["wav", "mp3", "ogg", "flac", "webm"];
const API_URL = "https://gopalgoyal12-voice-detection-api.hf.space/";

export default function VoiceDetection() {
  const [apiKey, setApiKey] = useState("");
  const [language, setLanguage] = useState("english");
  const [audioFormat, setAudioFormat] = useState("wav");
  const [audioFile, setAudioFile] = useState(null);
  const [audioBase64, setAudioBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setAudioFile(file);
    setError("");
    setResult(null);

    const reader = new FileReader();
    reader.onload = () => {
      // Strip the data URL prefix to get only the base64 string
      const base64 = reader.result.split(",")[1];
      setAudioBase64(base64);
    };
    reader.onerror = (e) =>
      setError(`Failed to read audio file: ${e.target.error?.message ?? "unknown error"}.`);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!apiKey.trim()) {
      setError("Please enter your API security key.");
      return;
    }
    if (!audioBase64) {
      setError("Please select an audio file.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          language,
          audioFormat,
          audioBase64,
        }),
      });

      if (!response.ok) {
        let errorText = "";
        try {
          errorText = await response.text();
        } catch {
          // ignore body-read errors
        }
        throw new Error(
          `API error (${response.status})${errorText ? `: ${errorText}` : "."}`
        );
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎙️ Voice Detection</h1>
      <p style={styles.subheading}>
        Detect whether an audio clip is AI-generated and identify its language.
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* API Key */}
        <label style={styles.label}>
          API Security Key
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            style={styles.input}
            autoComplete="off"
          />
        </label>

        {/* Language */}
        <label style={styles.label}>
          Language
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.input}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </label>

        {/* Audio Format */}
        <label style={styles.label}>
          Audio Format
          <select
            value={audioFormat}
            onChange={(e) => setAudioFormat(e.target.value)}
            style={styles.input}
          >
            {AUDIO_FORMATS.map((fmt) => (
              <option key={fmt} value={fmt}>
                {fmt.toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        {/* Audio File */}
        <label style={styles.label}>
          Audio File
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
        </label>
        {audioFile && (
          <p style={styles.fileName}>Selected: {audioFile.name}</p>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Analyzing…" : "Detect"}
        </button>
      </form>

      {/* Error */}
      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Result */}
      {result && (
        <div style={styles.resultBox}>
          <h2 style={styles.resultHeading}>Result</h2>
          <p style={styles.resultItem}>
            <strong>AI Generated:</strong>{" "}
            <span
              style={{
                color: result.isAiGenerated ? "#e74c3c" : "#27ae60",
                fontWeight: "bold",
              }}
            >
              {result.isAiGenerated ? "Yes ⚠️" : "No ✅"}
            </span>
          </p>
          <p style={styles.resultItem}>
            <strong>Detected Language:</strong>{" "}
            {result.language
              ? result.language.charAt(0).toUpperCase() +
                result.language.slice(1)
              : "N/A"}
          </p>
          {result.confidence !== undefined && (
            <p style={styles.resultItem}>
              <strong>Confidence:</strong>{" "}
              {/* API may return confidence as 0-1 or 0-100; normalise to percentage */}
              {result.confidence > 1
                ? result.confidence.toFixed(1)
                : (result.confidence * 100).toFixed(1)}
              %
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "480px",
    margin: "40px auto",
    padding: "24px",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
  },
  heading: {
    fontSize: "1.6rem",
    marginBottom: "4px",
    color: "#1a202c",
  },
  subheading: {
    color: "#718096",
    marginBottom: "24px",
    fontSize: "0.95rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#2d3748",
  },
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "0.95rem",
    backgroundColor: "#fff",
    outline: "none",
  },
  fileInput: {
    fontSize: "0.9rem",
  },
  fileName: {
    color: "#4a5568",
    fontSize: "0.85rem",
    margin: "0",
  },
  button: {
    marginTop: "8px",
    padding: "10px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  errorBox: {
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#fff5f5",
    border: "1px solid #fc8181",
    borderRadius: "6px",
    color: "#c53030",
    fontSize: "0.9rem",
  },
  resultBox: {
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#f0fff4",
    border: "1px solid #9ae6b4",
    borderRadius: "8px",
  },
  resultHeading: {
    fontSize: "1.1rem",
    marginBottom: "10px",
    color: "#22543d",
  },
  resultItem: {
    margin: "6px 0",
    fontSize: "0.95rem",
    color: "#2d3748",
  },
};
