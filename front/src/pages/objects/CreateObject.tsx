
export default function CreateObject(){
  const strBody = JSON.stringify({
    "name": "string", // required
    "category": "string",
    "options": {
      "descriptions": {
        "descripton": "string",
        "summary": "string"
      },
      "stats": { // if present, all fields are required
        "strength": 11,
        "dexterity": 11,
        "intelligence": 11,
        "constitution": 11,
        "wisdom": 11,
        "charisma": 11
      },
      "others": [{
        "name": "string",
        "descripton": "string",
        "content": "string"
      }]
    },
    "visibility": "public | private",
    "search_tags": ["string"]
  })

  return (
    <div>
      <p>Front not implemented yet. Create directly from API 
        <br></br>route: post /objects while auth with body :
        <br></br> {strBody}
      </p>
    </div>
  )
}