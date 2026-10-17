import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsDir = path.join(__dirname, "../data/products");

const categories = [
  "fan-brushes",
  "flat-brushes",
  "round-brushes",
  "acrylic-paint",
  "oil-paint",
  "watercolor-paint",
  "canvas-paper",
  "drawing-paper",
  "watercolor-paper",
  "charcoal-pencils",
  "colored-pencils",
  "graphite-pencils",
];

const categoryTypes = {
  "fan-brushes": "brushes",
  "flat-brushes": "brushes",
  "round-brushes": "brushes",
  "acrylic-paint": "paint",
  "oil-paint": "paint",
  "watercolor-paint": "paint",
  "canvas-paper": "paper",
  "drawing-paper": "paper",
  "watercolor-paper": "paper",
  "charcoal-pencils": "pencils",
  "colored-pencils": "pencils",
  "graphite-pencils": "pencils",
};

// Håller koll på ID:n så att de inte upprepas.
const allProductIds = new Set();

function generateProductId() {
  let productId;

  do {
    productId = randomUUID().slice(0, 6);
  } while (allProductIds.has(productId));

  allProductIds.add(productId);

  return productId;
}

async function addProductFields() {
  const updatedFiles = [];

  // Läs in och validera alla filer innan de skrivs över.
  for (const category of categories) {
    const filePath = path.join(productsDir, `${category}.json`);
    const content = await readFile(filePath, "utf8");
    const products = JSON.parse(content);

    if (!Array.isArray(products)) {
      throw new Error(`${category}.json måste innehålla en array.`);
    }

    const updatedProducts = products.map((product) => ({
      ...product,
      productId: generateProductId(),
      category,
      productType: categoryTypes[category],
    }));

    updatedFiles.push({ filePath, updatedProducts, category });
  }

  // Skriv de uppdaterade produkterna till filerna.
  for (const { filePath, updatedProducts, category } of updatedFiles) {
    await writeFile(
      filePath,
      JSON.stringify(updatedProducts, null, 2) + "\n",
      "utf8",
    );

    console.log(`Uppdaterade ${category}.json`);
  }

  console.log(
    `Klart! ${allProductIds.size} produkter har fått unika productId.`,
  );
}

addProductFields().catch((error) => {
  console.error("Kunde inte uppdatera produkterna:", error);
  process.exitCode = 1;
});
