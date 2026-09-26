/* Bitwise Python worker: loads Pyodide once, then runs student code through harness.py (injected as HARNESS at build). */
const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
importScripts(PYODIDE + "pyodide.js");
let api = null;
const ready = (async () => {
  const py = await loadPyodide({ indexURL: PYODIDE, stdout: () => {}, stderr: () => {} });
  py.runPython(HARNESS);
  api = py.globals.get("api");
  postMessage({ type: "ready" });
})().catch(e => postMessage({ type: "fatal", error: String(e && e.message || e) }));

onmessage = async ({ data }) => {
  try {
    await ready;
    if (!api) throw new Error("Python didn't start");
    postMessage({ id: data.id, ok: true, result: JSON.parse(api(JSON.stringify(data.payload))) });
  } catch (e) {
    postMessage({ id: data.id, ok: false, error: String(e && e.message || e) });
  }
};
