#!/usr/bin/env bash
set -eE

# create JSON data
json=$(cat <<-END
    {
        "baseURL": "${SERVER_URL}"
    }
END
)

# safe it to config.json
echo "creating src/config.json"
echo "$json" > "src/config.json"