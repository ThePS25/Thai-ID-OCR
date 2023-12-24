import vision from "@google-cloud/vision";
import { cleanData } from "./cardcln.js";

const CREDENTIALS = JSON.parse(
  JSON.stringify({
    // Put your service account api credentials here

    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCkNTKjCuGvopEf\nfM2ptSswmcK8asTzCRJrJzeRAR5GHXcueQKT6YTXNcPwU/r5uhidlRQBrax21nzP\nUd3q0lF+COPxEQFoN6R7aeMCLhRVWFvY85L9ebimSdtu8fmNHig/GydZ9tsNIhVC\nold3goIvUhy+tEhvGouKnuKzt2xbxYIoCDSFDre1Uyly9GQEkQwh84F/cVL606dC\nOrZhtTyLYjpHGTyJRdC84Wo5HMoUXbKCoKkkXWVmueaIwMIDm5edL9fKzvJEvNYi\nn5BRyTZaou4DUbXZ7ebhdpHbtrHDksL3CB6Nec0OBDeyVMLiyZyaH0wnhtYAjLxH\nbIAHBViXAgMBAAECggEABTQjCX6qnehpb+rXu5/gTAHQutbUAfL7e0YlYSTSGEe5\nGKcWDqjmSvRLDskihBptIEVH+oZN7QApZAqEnVCSljYNlHyaTlABGDYdTwWLIxSR\n6I34zlaL+Z0P5UlUGVrnd0R9hUDTj+wmFKlUsJaurcriL/rs7AnBJUtEBOJJqUjL\n0v3YzBtd/cPark+QxjVOyXPZdloB0ce6oaA9yuWDvsqqhx7a8NFbZHJjGZsrQPci\nV/fdNjqmzMbT2+QAenBZnj2zn0clQDUyHbDdvjYn9/5Sgffgu2GSapDOp00gphdE\nWZOp34ezAx6VVsU4doHXHExgeC+i8QB2pgfFwfn3cQKBgQDeXQb9eu70GIT50hia\nhxkqcGKqaUOI9lZmDqyQpGSiXq0WVd/YSlqtx+QVZeZQGg6z67JX7Rhp0RS2nHCZ\nexuyGG1yb6AfFJEmTxS35lY5XaL5B7ImU8CVur2nmQ4XeP6vkBTNAMNcTgU/vbCd\nu2vr9YhWSu9C3UkL2k+bMd3URwKBgQC9DBvDcZBarXHTkglSplyJu5hUJ6UmWS/F\n9GXZlgmqokBUD/O4EJ3S4TZV36ZgfI0p91Ga7+qGBP/FG6SxYn5eiFszAU+Bz38o\nnnqqL5iaUSyZYc2dyngfWx+RRUDsPD+/45xCQvNOsI46Sj25fsOoCdUiiY9xsgl9\nX/lwulERMQKBgHMkmMoJLlMXn0P9lt/ttQpUx8KWX3I8nOCcGJ+NgM7TV62JKjBF\n0E7Mgz7RVUGFPLfOBLui+lFRAvjMaUIQjXbbT1FCnBd7/u1nZcMUcvGhmxJ4+bb/\nB2qBGFQA3VsqPDeM1DiTfJX/kJhBEYOb2XaF3eNRSjPFgl2w3ifu2n9hAoGAFjSf\n5jsmq6AH6MQUmEK2R+9jGy909KYxOF1WwVIgXIymZblh9VLuVuDhUwDsOBUpN663\nRS29LHTV3j86/yMEmPIHVFxpDGRlGU5UNj1U/Xtfc7zLPCeWKIi5koTB9X22N0Hz\nDs1yauHOMwaZbXp4XPqasG3cDYzOFI37bMRV1WECgYB0UfmvqRy8/C9kgVbyuBkv\nYdD6OqtRQfpQ8djeltuHL0GbDN1vA8jHNu2VDuMOJzCQJB7ByF2VfXX55z/vnk3W\nfRwLp9hSuk2mEqsepfWS9hZ6wxCgITPDg3CUWTJbtEHehWmB0Q/8AujklIThwxF/\nbODZbTC6TVq5OdiAPiOCow==\n-----END PRIVATE KEY-----\n",
    client_email: "ocrapp1@reliable-alpha-409016.iam.gserviceaccount.com",
  })
);

const CONFIG = {
  credentials: {
    private_key: CREDENTIALS.private_key,
    client_email: CREDENTIALS.client_email,
  },
};

const client = new vision.ImageAnnotatorClient(CONFIG);
function removeThaiWords(sentence) {
  const thaiCharacterRange = /[\u0E00-\u0E7F]/;

  const words = sentence.split(/\s+/);

  const nonThaiWords = words.filter((word) => !thaiCharacterRange.test(word));

  const modifiedSentence = nonThaiWords.join(" ");

  return modifiedSentence;
}
export const ocrData = async (path) => {
  let [result] = await client.textDetection(path);
  let arrString = result.fullTextAnnotation.text;
  let cleanText = removeThaiWords(arrString);
  console.log(cleanText);
  let data = cleanData(cleanText);
  return data;
};
