#!/usr/bin/env node

import fs from "fs";
import path from "path";

const componentName = process.argv[2];

if (!componentName) {
  console.error("❌ Please provide a component name.");
  console.error("👉 Example: node create-component.js MyComponent");
  process.exit(1);
}

const componentsDir = path.resolve("src/components");
const componentDir = path.join(componentsDir, componentName);

// Create folder
if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
}

// File paths
const tsxFile = path.join(componentDir, `${componentName}.tsx`);
const scssFile = path.join(componentDir, `${componentName}.module.scss`);

// Component boilerplate
const tsxTemplate = `import styles from './${componentName}.module.scss';

export default function ${componentName}() {
  return (
    <div className={styles.${componentName[0].toLowerCase() + componentName.slice(1)}}>
      This is ${componentName}
    </div>
  );
}
`;

// SCSS boilerplate
const scssTemplate = `.${componentName[0].toLowerCase() + componentName.slice(1)} {
  border: 1px solid red;
}
`;

// Write files if they don’t exist
if (!fs.existsSync(tsxFile)) {
  fs.writeFileSync(tsxFile, tsxTemplate);
  console.log(`✅ Created: ${tsxFile}`);
} else {
  console.log(`⚠️ File already exists: ${tsxFile}`);
}

if (!fs.existsSync(scssFile)) {
  fs.writeFileSync(scssFile, scssTemplate);
  console.log(`✅ Created: ${scssFile}`);
} else {
  console.log(`⚠️ File already exists: ${scssFile}`);
}