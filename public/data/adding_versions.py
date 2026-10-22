from pathlib import Path

prefix = """{
	"version": 1,
	"data":
"""

suffix = """
}
"""

for path in Path(".").glob("hsk*.json"):
    original = path.read_text(encoding="utf-8")

    path.write_text(
        prefix + original + suffix,
        encoding="utf-8"
    )
