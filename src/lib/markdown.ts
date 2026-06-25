import { remark } from "remark";
import html from "remark-html";

export async function renderMarkdown(content: string | null | undefined): Promise<string> {
  if (!content) return "";
  const result = await remark().use(html).process(content);
  return result.toString();
}
