/**
 * Finds the index of the matching closing brace for the first { in str.
 * Properly skips braces inside strings to handle HTML/CSS/JS in the "code" field.
 */
function findMatchingBrace(str, startIndex = 0) {
    let depth = 0;
    let inString = false;
    let escape = false;
    let stringChar = null;
    for (let i = startIndex; i < str.length; i++) {
        const c = str[i];
        if (escape) {
            escape = false;
            continue;
        }
        if (inString) {
            if (c === "\\") escape = true;
            else if (c === stringChar) inString = false;
            continue;
        }
        if (c === '"' || c === "'") {
            inString = true;
            stringChar = c;
            continue;
        }
        if (c === "{") depth++;
        if (c === "}") {
            depth--;
            if (depth === 0) return i;
        }
    }
    return -1;
}

const extractJson = (text) => {
    if (!text || typeof text !== "string") return null;

    const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const firstBrace = cleaned.indexOf("{");
    if (firstBrace === -1) return null;

    const closeBrace = findMatchingBrace(cleaned, firstBrace);
    if (closeBrace === -1) return null;

    const jsonString = cleaned.slice(firstBrace, closeBrace + 1);

    try {
        return JSON.parse(jsonString);
    } catch (err) {
        console.warn("extractJson: JSON.parse failed", err.message);
        return null;
    }
};

export default extractJson;