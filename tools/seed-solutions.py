#!/usr/bin/env python3
"""Uploads the Coding Lab model solutions to the teacher-only Firestore collection `codeSolutions`.

The solutions live in solutions/code-solutions.json, which is never committed or bundled into app.js.
Security rules let teachers read the collection and nobody write it, so this uses the project owner's
Google credentials (which bypass the rules):

    GOOGLE_ACCESS_TOKEN=$(gcloud auth print-access-token) python3 tools/seed-solutions.py

Run it again after adding or changing challenges.
"""
import json, os, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
project = json.load(open(os.path.join(ROOT, ".firebaserc")))["projects"]["default"]
token = os.environ.get("GOOGLE_ACCESS_TOKEN")
if not token:
    sys.exit("Set GOOGLE_ACCESS_TOKEN (e.g. from `gcloud auth print-access-token`).")
sols = json.load(open(os.path.join(ROOT, "solutions", "code-solutions.json")))
base = f"projects/{project}/databases/(default)/documents"
ids = list(sols)
for i in range(0, len(ids), 400):
    writes = [{"update": {"name": f"{base}/codeSolutions/{cid}", "fields": {"solution": {"stringValue": sols[cid]}}}} for cid in ids[i:i + 400]]
    req = urllib.request.Request(f"https://firestore.googleapis.com/v1/{base}:commit", data=json.dumps({"writes": writes}).encode(),
                                 headers={"Authorization": "Bearer " + token, "Content-Type": "application/json", "x-goog-user-project": project})
    try:
        urllib.request.urlopen(req).read()
    except urllib.error.HTTPError as e:
        sys.exit(f"Firestore said {e.code}: {e.read().decode()[:400]}")
print(f"Uploaded {len(ids)} model solutions to {project}/codeSolutions")
