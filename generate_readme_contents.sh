#!/bin/bash

# Function to list files and directories
list_contents() {
	local path="$1"
	local indent="$2"
	for entry in "$path"/*; do
		if [ -d "$entry" ]; then
			echo "| ${indent}$(basename "$entry")/ | Directory |" >>README.md
			list_contents "$entry" "    $indent"
		else
			echo "| ${indent}$(basename "$entry") | File |" >>README.md
		fi
	done
}

# Output header for README
echo "# Contents of $(pwd)" >README.md
echo "" >>README.md
echo "| File/Folder Name | Type |" >>README.md
echo "|------------------|------|" >>README.md

# List all files and directories
list_contents "." ""

echo "README.md has been generated with a list of files/folders."
