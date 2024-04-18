#!/bin/bash

# dist directory - directory to read droplists and delete files from
directory="public"

# array of files to be deleted
files_to_delete=()

# Function to process a .droplist file
process_droplist() {
  local droplist_file="$1"

  # Read the contents of the .droplist file line by line
  while IFS= read -r target_file; do
    # Construct the full path for the target file relative to the directory
    target_file="$directory$target_file"

    # Check if the target exists
    if [[ -f "$target_file" ]]; then
      files_to_delete+=("$target_file")
    fi
  done < "$droplist_file"

  # Add the .droplist file itself to the array for deletion
  files_to_delete+=("$droplist_file")
}

# Function to get all .droplist files from the dist directory
process_nested_droplists() {
  local directory="$1"

  # read all files recursively from dist dir and process droplists
  while IFS= read -r filename; do
    if [[ "$filename" =~ \.droplist$ ]]; then
      process_droplist "$filename"
    fi
  done < <(find $directory -type f -print)
}

# Check if the directory exists
if [[ ! -d "$directory" ]]; then
  echo "Error: Directory '$directory' does not exist."
  exit 1
fi

# Start processing nested .droplist files
process_nested_droplists "$directory"

# Delete all files in the array (without confirmation)
if [[ ${#files_to_delete[@]} -gt 0 ]]; then
  # Only return the first occurrence of a file in the array
  dedup_files_to_delete=()
  while IFS= read -r element; do
    dedup_files_to_delete+=("$element")
  done < <(printf "%s\n" "${files_to_delete[@]}" | sort -u)

  echo "Deleting files:"
  printf "\t* %s\n" "${dedup_files_to_delete[@]}"
  # Delete the files
  rm -rf "${files_to_delete[@]}"
  echo "Files deleted successfully."
else
  echo "No files found for deletion."
fi
