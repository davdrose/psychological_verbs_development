import json
import csv
from pathlib import Path


INPUT_PATH = Path("data.json")
OUTPUT_PATH = Path("data.csv")

COLUMNS = [
    "participant_id",
    "condition",
    "scenario_order",
    "balloon_question_order",
    "drum_question_order",
    # Balloon scenario responses
    "balloon_pop",
    "balloon_cause_pop",
    "balloon_sad",
    "balloon_cause_sad",
    # Drum scenario responses
    "drum_break",
    "drum_cause_break",
    "drum_anger",
    "drum_cause_anger",
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
            question_orders = rec.get("question_orders", {}) or {}
            
            # Convert scenario_order list to string (e.g., "balloon,drum")
            scenario_order_str = ",".join(scenario_order) if scenario_order else ""
            
            # Convert question orders to strings
            balloon_q_order_str = ",".join(question_orders.get("balloon", [])) if "balloon" in question_orders else ""
            drum_q_order_str = ",".join(question_orders.get("drum", [])) if "drum" in question_orders else ""

            row = {
                "participant_id": rec.get("participant_id", ""),
                "condition": rec.get("condition", ""),
                "scenario_order": scenario_order_str,
                "balloon_question_order": balloon_q_order_str,
                "drum_question_order": drum_q_order_str,
                # Balloon scenario responses
                "balloon_pop": responses.get("balloon_pop", ""),
                "balloon_cause_pop": responses.get("balloon_cause_pop", ""),
                "balloon_sad": responses.get("balloon_sad", ""),
                "balloon_cause_sad": responses.get("balloon_cause_sad", ""),
                # Drum scenario responses
                "drum_break": responses.get("drum_break", ""),
                "drum_cause_break": responses.get("drum_cause_break", ""),
                "drum_anger": responses.get("drum_anger", ""),
                "drum_cause_anger": responses.get("drum_cause_anger", ""),
                # Demographics
                "age": participants.get("age", ""),
                "race": participants.get("race", ""),
                "gender": participants.get("gender", ""),
                "ethnicity": participants.get("ethnicity", ""),
            }
            writer.writerow(row)


if __name__ == "__main__":
    main()
