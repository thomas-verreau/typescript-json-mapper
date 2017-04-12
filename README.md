# typescript-json-mapper

typescript-json-mapper enables to map JSON to typescript objects.

## Mapping simple data fields

class SimplePerson {

  @JsonField()
  firstName: string;

  lastName: string;

}

let objectMapper = new ObjectMapper();
let person: SimplePerson = objectMapper.readValue<SimplePerson>({
    firstName: "James",
    lastName: "Bond"
}, SimplePerson);

expect(person).toBeDefined();
expect(person.firstName).toBeDefined();
expect(person.firstName).toBe("James");
