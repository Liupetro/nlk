import { redirect } from "next/navigation";

/** Industries live only inside /products */
export default function IndustriesRedirectPage() {
  redirect("/products");
}
