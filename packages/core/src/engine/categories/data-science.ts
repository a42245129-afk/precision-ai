import { createCategory } from "./factory.js";

export const dataScienceCategory = createCategory("data-science", [
  { signal: "dataset or data preparation", pattern: /\b(dataset|dataframe|pandas|clean data|feature engineering|etl|data pipeline)\b/i },
  { signal: "exploratory analysis or visualization", pattern: /\b(exploratory data analysis|eda|data analysis|visuali[sz]ation|data quality)\b/i }
], {
  ultra: "State the data workflow and the key result or code.",
  balanced: "Outline the data method and interpret the useful findings.",
  detailed: "Explain data preparation, analytical method, validation, and limitations."
});