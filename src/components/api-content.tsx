"use client";

import { ChevronDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/code-block";

interface APIEndpoint {
  id: string;
  method: string;
  path: string;
  title: string;
  description: string;
}

interface APIContentCardProps {
  endpoint: APIEndpoint;
  onTryIt: (endpoint: APIEndpoint) => void;
}

// Returns an object with code samples for each language, given an endpoint ID.
function getExamples(endpointId: string) {
  switch (endpointId) {
    case "index-repository":
      return {
        curl: `curl --request POST \\
  --url https://api.greptile.com/v2/repositories \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --header 'X-GitHub-Token: <api-key>' \\
  --data '{
    "remote": "<string>",
    "repository": "<string>",
    "branch": "<string>",
    "reload": true,
    "notify": true
}'`,
        python: `import requests

url = "https://api.greptile.com/v2/repositories"
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json",
    "X-GitHub-Token": "<api-key>"
}
data = {
    "remote": "<string>",
    "repository": "<string>",
    "branch": "<string>",
    "reload": True,
    "notify": True
}

response = requests.post(url, headers=headers, json=data)
print(response.status_code, response.text)`,
        javascript: `fetch("https://api.greptile.com/v2/repositories", {
  method: "POST",
  headers: {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json",
    "X-GitHub-Token": "<api-key>"
  },
  body: JSON.stringify({
    remote: "<string>",
    repository: "<string>",
    branch: "<string>",
    reload: true,
    notify: true
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));`,
        php: `<?php
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://api.greptile.com/v2/repositories");
curl_setopt($ch, CURLOPT_POST, 1);

$headers = [
  "Authorization: Bearer <token>",
  "Content-Type: application/json",
  "X-GitHub-Token: <api-key>"
];
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$data = [
  "remote" => "<string>",
  "repository" => "<string>",
  "branch" => "<string>",
  "reload" => true,
  "notify" => true
];
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

echo $response;`,
        go: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
)

func main() {
    url := "https://api.greptile.com/v2/repositories"
    payload := map[string]interface{}{
        "remote": "<string>",
        "repository": "<string>",
        "branch": "<string>",
        "reload": true,
        "notify": true,
    }
    body, _ := json.Marshal(payload)

    req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
    if err != nil {
        fmt.Println("Error creating request:", err)
        return
    }

    req.Header.Set("Authorization", "Bearer <token>")
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("X-GitHub-Token", "<api-key>")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Println("Error making request:", err)
        return
    }
    defer resp.Body.Close()

    respBody, err := io.ReadAll(resp.Body)
    if err != nil {
        fmt.Println("Error reading response:", err)
        return
    }

    fmt.Println("Status:", resp.Status)
    fmt.Println("Response:", string(respBody))
}`,
        java: `import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class Main {
    public static void main(String[] args) {
        try {
            URL url = new URL("https://api.greptile.com/v2/repositories");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer <token>");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("X-GitHub-Token", "<api-key>");
            conn.setDoOutput(true);

            String jsonInputString = "{ \\"remote\\": \\"<string>\\", \\"repository\\": \\"<string>\\", \\"branch\\": \\"<string>\\", \\"reload\\": true, \\"notify\\": true }";

            try(OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int responseCode = conn.getResponseCode();
            System.out.println("Response code: " + responseCode);
            // Read response ...
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`,
      };

    case "get-repository-info":
      return {
        curl: `curl --request GET \\
  --url https://api.greptile.com/v2/repositories/{repositoryId} \\
  --header 'Authorization: Bearer <token>'`,
        python: `import requests

url = "https://api.greptile.com/v2/repositories/{repositoryId}"
headers = {
    "Authorization": "Bearer <token>"
}

response = requests.get(url, headers=headers)
print(response.status_code, response.text)`,
        javascript: `fetch("https://api.greptile.com/v2/repositories/{repositoryId}", {
  method: "GET",
  headers: {
    "Authorization": "Bearer <token>"
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));`,
        php: `<?php
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://api.greptile.com/v2/repositories/{repositoryId}");
curl_setopt($ch, CURLOPT_HTTPGET, 1);

$headers = ["Authorization: Bearer <token>"];
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

echo $response;`,
        go: `package main

import (
    "fmt"
    "io"
    "net/http"
    "os"
)

func main() {
    url := "https://api.greptile.com/v2/repositories/{repositoryId}"
    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        fmt.Println("Error creating request:", err)
        return
    }

    req.Header.Set("Authorization", "Bearer <token>")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Println("Error making request:", err)
        return
    }
    defer resp.Body.Close()

    respBody, err := io.ReadAll(resp.Body)
    if err != nil {
        fmt.Println("Error reading response:", err)
        return
    }

    fmt.Println("Status:", resp.Status)
    fmt.Println("Response:", string(respBody))
}`,
        java: `import java.net.HttpURLConnection;
import java.net.URL;

public class Main {
    public static void main(String[] args) {
        try {
            URL url = new URL("https://api.greptile.com/v2/repositories/{repositoryId}");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Authorization", "Bearer <token>");

            int responseCode = conn.getResponseCode();
            System.out.println("Response code: " + responseCode);
            // Read response...
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`,
      };

    case "query-repo":
      return {
        curl: `curl --request POST \\
  --url https://api.greptile.com/v2/query \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --header 'X-GitHub-Token: <api-key>' \\
  --data '{
  "messages": [
    {
      "id": "<string>",
      "content": "<string>",
      "role": "<string>"
    }
  ],
  "repositories": [
    {
      "remote": "<string>",
      "branch": "<string>",
      "repository": "<string>"
    }
  ],
  "sessionId": "<string>",
  "stream": true,
  "genius": true
}'`,
        python: `import requests

url = "https://api.greptile.com/v2/query"
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json",
    "X-GitHub-Token": "<api-key>"
}
data = {
    "messages": [
        {
            "id": "<string>",
            "content": "<string>",
            "role": "<string>"
        }
    ],
    "repositories": [
        {
            "remote": "<string>",
            "branch": "<string>",
            "repository": "<string>"
        }
    ],
    "sessionId": "<string>",
    "stream": True,
    "genius": True
}

response = requests.post(url, headers=headers, json=data)
print(response.status_code, response.text)`,
        javascript: `fetch("https://api.greptile.com/v2/query", {
  method: "POST",
  headers: {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json",
    "X-GitHub-Token": "<api-key>"
  },
  body: JSON.stringify({
    messages: [
      {
        id: "<string>",
        content: "<string>",
        role: "<string>"
      }
    ],
    repositories: [
      {
        remote: "<string>",
        branch: "<string>",
        repository: "<string>"
      }
    ],
    sessionId: "<string>",
    stream: true,
    genius: true
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));`,
        php: `<?php
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://api.greptile.com/v2/query");
curl_setopt($ch, CURLOPT_POST, 1);

$headers = [
  "Authorization: Bearer <token>",
  "Content-Type: application/json",
  "X-GitHub-Token: <api-key>"
];
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$data = [
  "messages" => [
    [
      "id" => "<string>",
      "content" => "<string>",
      "role" => "<string>"
    ]
  ],
  "repositories" => [
    [
      "remote" => "<string>",
      "branch" => "<string>",
      "repository" => "<string>"
    ]
  ],
  "sessionId" => "<string>",
  "stream" => true,
  "genius" => true
];
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

echo $response;`,
        go: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
)

func main() {
    url := "https://api.greptile.com/v2/query"
    payload := map[string]interface{}{
        "messages": []map[string]string{
            {
                "id": "<string>",
                "content": "<string>",
                "role": "<string>",
            },
        },
        "repositories": []map[string]string{
            {
                "remote": "<string>",
                "branch": "<string>",
                "repository": "<string>",
            },
        },
        "sessionId": "<string>",
        "stream": true,
        "genius": true,
    }

    body, _ := json.Marshal(payload)
    req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
    if err != nil {
        fmt.Println("Error creating request:", err)
        return
    }

    req.Header.Set("Authorization", "Bearer <token>")
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("X-GitHub-Token", "<api-key>")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Println("Error making request:", err)
        return
    }
    defer resp.Body.Close()

    respBody, err := io.ReadAll(resp.Body)
    if err != nil {
        fmt.Println("Error reading response:", err)
        return
    }

    fmt.Println("Status:", resp.Status)
    fmt.Println("Response:", string(respBody))
}`,
        java: `import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class Main {
    public static void main(String[] args) {
        try {
            URL url = new URL("https://api.greptile.com/v2/query");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer <token>");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("X-GitHub-Token", "<api-key>");
            conn.setDoOutput(true);

            String jsonInputString = "{\\"messages\\":[{\\"id\\":\\"<string>\\",\\"content\\":\\"<string>\\",\\"role\\":\\"<string>\\"}],\\"repositories\\":[{\\"remote\\":\\"<string>\\",\\"branch\\":\\"<string>\\",\\"repository\\":\\"<string>\\"}],\\"sessionId\\":\\"<string>\\",\\"stream\\":true,\\"genius\\":true}";

            try(OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int responseCode = conn.getResponseCode();
            System.out.println("Response code: " + responseCode);
            // Read response...
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`,
      };

    default:
      return {
        curl: "No example available",
        python: "No example available",
        javascript: "No example available",
        php: "No example available",
        go: "No example available",
        java: "No example available",
      };
  }
}

export function APIContent({ endpoint, onTryIt }: APIContentCardProps) {
  // Grab the examples for this endpoint
  const examples = getExamples(endpoint.id);

  // The same "response" examples (JSON structure) as you had before.
  const getResponseExample = (endpoint: APIEndpoint) => {
    switch (endpoint.id) {
      case "index-repository":
        return `{
  "message": "<string>",
  "statusEndpoint": "<string>"
}`;
      case "get-repository-info":
        return `{
  "repository": "<string>",
  "remote": "<string>",
  "branch": "<string>",
  "private": true,
  "status": "<string>",
  "filesProcessed": 123,
  "numFiles": 123,
  "sha": "<string>"
}`;
      case "query-repo":
        return `{
  "message": "<string>",
  "sources": [
    {
      "repository": "<string>",
      "remote": "<string>",
      "branch": "<string>",
      "filepath": "<string>",
      "linestart": 123,
      "lineend": 123,
      "summary": "<string>"
    }
  ]
}`;
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded shadow p-6 relative">
      {/* Optional vertical line for "timeline" UI */}
      <div className="absolute left-0 top-6 -translate-x-1/2 w-1 bg-muted h-full" />

      <div className="relative">
        <span className="text-sm text-muted-foreground">API Reference</span>
        <h1 className="text-2xl font-bold">{endpoint.title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-medium px-2 py-1 rounded ${
            endpoint.method === "GET"
              ? "bg-green-100 text-green-700"
              : endpoint.method === "POST"
              ? "bg-blue-100 text-blue-700"
              : endpoint.method === "PUT"
              ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {endpoint.method}
        </span>
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {endpoint.path}
        </code>
      </div>

      <p className="text-muted-foreground">{endpoint.description}</p>

      <Button
        onClick={() => onTryIt(endpoint)}
        className="flex items-center gap-2 self-start"
      >
        Try it <ChevronDown className="h-4 w-4" />
      </Button>

      {/* Tabs for each language sample */}
      <Tabs defaultValue="curl" className="mt-4">
        <TabsList className="mb-4">
          <TabsTrigger value="curl">cURL</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="php">PHP</TabsTrigger>
          <TabsTrigger value="go">Go</TabsTrigger>
          {/* <TabsTrigger value="java">Java</TabsTrigger> */}
        </TabsList>

        {/* cURL */}
        <TabsContent value="curl" className="relative">
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <CodeBlock language="bash" code={examples.curl} />
        </TabsContent>

        {/* Python */}
        <TabsContent value="python" className="relative">
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <CodeBlock language="python" code={examples.python} />
        </TabsContent>

        {/* JavaScript */}
        <TabsContent value="javascript" className="relative">
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <CodeBlock language="javascript" code={examples.javascript} />
        </TabsContent>

        {/* PHP */}
        <TabsContent value="php" className="relative">
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <CodeBlock language="php" code={examples.php} />
        </TabsContent>

        {/* Go */}
        <TabsContent value="go" className="relative">
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <CodeBlock language="go" code={examples.go} />
        </TabsContent>

        {/* Java */}
        <TabsContent value="java" className="relative">
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <CodeBlock language="java" code={examples.java} />
        </TabsContent>
      </Tabs>

      <h2 className="text-xl font-semibold mt-4">Response</h2>
      <div className="relative">
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {getResponseExample(endpoint) ? (
          <CodeBlock language="json" code={getResponseExample(endpoint)} />
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No example available
          </div>
        )}
      </div>
    </div>
  );
}
