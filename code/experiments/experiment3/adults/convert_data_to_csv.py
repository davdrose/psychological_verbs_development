import json
import csv
from pathlib import Path


INPUT_PATH = Path("data.json")
OUTPUT_PATH = Path("data.csv")

COLUMNS = [
    "participant_id",
    "condition",
    "scenario_order",
    "question_order",
    # Excited scenario responses
    "excited_cause",
    "excited_lexical",
    # Scared scenario responses
    "scared_cause",
    "scared_lexical",
    # Demographics
    "age",
    "race",
    "gender",
    "ethnicity",
]


def load_records(path: Path):
    """
    Parse data.json, which contains multiple JSON objects separated by blank
    lines and commas, plus one stray '×' character.
    We turn the whole thing into a single JSON array and load it.
    """
    text = path.read_text(encoding="utf-8")
    # Remove the single stray '×' marker
    text = text.replace("×", "")

    # Wrap as a JSON array. The file is already a sequence of
    # `{ ... },` blocks, so this should be valid as-is.
    array_text = "[\n" + text + "\n]"

    return json.loads(array_text)


def main():
    records = load_records(INPUT_PATH)

    with OUTPUT_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=COLUMNS)
        writer.writeheader()

        for rec in records:
            responses = rec.get("responses", {}) or {}
            participants = rec.get("participants", {}) or {}
            scenario_order = rec.get("scenario_order", [])
            question_order = rec.get("question_order", [])
            
            # Convert scenario_order list to string (e.g., "excited,scared")
            scenario_order_str = ",".join(scenario_order) if scenario_order else ""
            question_order_str = ",".join(question_order) if question_order else ""

            row = {
                "participant_id": rec.get("participant_id", ""),
                "condition": rec.get("condition", ""),
                "scenario_order": scenario_order_str,
                "question_order": question_order_str,
                # Excited scenario responses
                "excited_cause": responses.get("excited_cause", ""),
                "excited_lexical": responses.get("excited_lexical", ""),
                # Scared scenario responses
                "scared_cause": responses.get("scared_cause", ""),
                "scared_lexical": responses.get("scared_lexical", ""),
                # Demographics
                "age": participants.get("age", ""),
                "race": participants.get("race", ""),
                "gender": participants.get("gender", ""),
                "ethnicity": participants.get("ethnicity", ""),
            }
            writer.writerow(row)


if __name__ == "__main__":
    main()
