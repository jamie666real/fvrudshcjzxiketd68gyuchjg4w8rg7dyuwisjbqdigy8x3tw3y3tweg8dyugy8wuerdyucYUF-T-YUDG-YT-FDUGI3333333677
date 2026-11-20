let pyodideInstance = null;

// Initialize Pyodide when the page loads
async function initPyodide() {
    const statusBadge = document.getElementById("py-status");
    try {
        pyodideInstance = await loadPyodide();
        statusBadge.innerText = "✅ Interactive Python 3.11 Ready!";
        statusBadge.style.borderColor = "#4ade80";
        statusBadge.style.color = "#bbf7d0";
    } catch (err) {
        statusBadge.innerText = "⚠️ Offline mode (Python engine failed to load)";
    }
}
initPyodide();

// Run user Python code and capture print() output
async function runPython(textareaId, outputId) {
    const code = document.getElementById(textareaId).value;
    const outputEl = document.getElementById(outputId);

    if (!pyodideInstance) {
        outputEl.style.color = "#fde047";
        outputEl.innerText = "Python engine is still loading... please wait a moment and try again.";
        return;
    }

    outputEl.style.color = "#94a3b8";
    outputEl.innerText = "Running...";

    try {
        // Redirect stdout to capture Python print statements
        pyodideInstance.runPython(`
import sys
import io
sys.stdout = io.StringIO()
        `);

        await pyodideInstance.runPythonAsync(code);
        const stdout = pyodideInstance.runPython("sys.stdout.getvalue()");

        outputEl.style.borderLeftColor = "#16a34a";
        outputEl.style.color = "#a7f3d0";
        outputEl.innerText = stdout.trim() ? stdout : "(Code ran successfully with no printed output)";
    } catch (err) {
        outputEl.style.borderLeftColor = "#dc2626";
        outputEl.style.color = "#fca5a5";
        outputEl.innerText = err.message;
    }
}

// Toggle hints
function toggleHint(hintId) {
    const hint = document.getElementById(hintId);
    hint.style.display = hint.style.display === "block" ? "none" : "block";
}

// Copy static code blocks
function copyCode(button) {
    const codeBlock = button.nextElementSibling.innerText;
    navigator.clipboard.writeText(codeBlock).then(() => {
        button.innerText = "Copied!";
        setTimeout(() => {
            button.innerText = "Copy";
        }, 2000);
    });
}
