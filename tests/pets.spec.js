// @ts-check
import { test, expect } from '@playwright/test';
import { defaultPetData } from './defaultPetData';
// base URL in config 'https://petstore.swagger.io/v2/',

async function outputToConsole(text, response){
  const responseJSON = await response.json()
  console.log(`\n ${text} Response body:`)
  console.log(responseJSON)
}

test('Should create new pet, get pet and delete pet', async ({ request }) => {
  const petId = Math.floor(Math.random() * 10000) + 400000;

  const checkPetNotExist = await request.get(`pet/${petId}`, {})  // get pet (GET)
  expect(checkPetNotExist.status()).toEqual(404);
  await outputToConsole('Pet is not exist.', checkPetNotExist)
    
  const createPet = await request.post(`pet`, {  // add net pet (POST)
    data: {...defaultPetData, ...{"id": petId}}
  })
  expect(createPet.ok()).toBeTruthy();
  expect(createPet.status()).toEqual(200);
  await outputToConsole('Pet has been created.', createPet)

  const getPet = await request.get(`pet/${petId}`, {})  // get pet (GET)
  expect(getPet.ok()).toBeTruthy();
  expect(getPet.status()).toEqual(200);
  await outputToConsole('Pet has been got.', getPet)

  const getPetByStatus = await request.get(`pet/findByStatus?status=${defaultPetData.status}`, {})  // find pet by status (GET)
  expect(getPetByStatus.ok()).toBeTruthy();
  expect(getPetByStatus.status()).toEqual(200);
  await outputToConsole('Pet has been found.', getPetByStatus)

  const deletePet = await request.delete(`pet/${petId}`, {})  // delete pet (DELETE)
  expect(deletePet.ok()).toBeTruthy();
  expect(deletePet.status()).toEqual(200);
  await outputToConsole('Pet has been deleted.', deletePet)

  const checkPetDeleted = await request.get(`pet/${petId}`, {})  // get pet (GET)
  expect(checkPetNotExist.status()).toEqual(404);
  await outputToConsole('Pet is not exist.', checkPetDeleted)
});
