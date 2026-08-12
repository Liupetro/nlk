import { redirect } from "next/navigation";

/** Legacy route — products section lives at /products */
export default function ProjectsRedirectPage() {
  redirect("/products");
}
