
import {ObjectMapper, JsonField} from '.';

describe("ObjectMapper", () => {
    describe("readValue", () => {

        //
        // ObjectMapper.readValue should copy fields with @JsonField decorator
        //
        it('should copy fields with @JsonField decorator', () => {

            /**
             * Test class
             */
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
        });


        //
        // ObjectMapper.readValue should copy fields with @JsonField decorator
        //
        it('should instanciate class for fields with @JsonField decorator', () => {

            /**
             * Test classes
             */
            class Car1 {

                @JsonField()
                color: string;

            }

            class Person1 {

                @JsonField({ type: Car1 })
                car: Car1;

            }

            let objectMapper = new ObjectMapper();
            let person: Person1 = objectMapper.readValue<Person1>({
                car: {
                    color: "blue"
                }
            }, Person1);

            expect(person).toBeDefined();
            expect(person.car).toBeDefined();
            expect(person.car.color).toBeDefined();
            expect(person.car.color).toBe("blue");
        });


        //
        // ObjectMapper.readValue should copy fields with @JsonField decorator
        //
        it('should instanciate class for array fields with @JsonField decorator', () => {

            /**
             * Test classes
             */
            class Car2 {

                @JsonField()
                color: string;

            }

            class Person2 {

                @JsonField({ type: Car2 })
                cars: Car2[];

            }

            let objectMapper = new ObjectMapper();
            let person: Person2 = objectMapper.readValue<Person2>({
                cars: [
                    { color: "blue" },
                    { color: "yellow" }
                ]}, Person2);

            expect(person).toBeDefined();
            expect(person.cars).toBeDefined();
            expect(person.cars[0]).toBeDefined();
            expect(person.cars[0].color).toBe("blue");
        });



    });
});