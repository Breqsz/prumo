import { getProject, type Project } from "@/lib/projects";

/**
 * Os cases que sobem para a home, em ordem de argumento: cliente pagante
 * primeiro. O portfólio pessoal (`breq-dev`) fica fora de propósito — é
 * marca Breq, voltada a recrutador, dentro do site do estúdio Prumo.
 * Explícito, e não um slice de `projects`, para que reordenar /trabalhos
 * não mude a home por acidente.
 */
export const HOME_CASE_SLUGS = [
  "hold-corretora",
  "todo",
  "desafog-ai",
  "bereading",
] as const;

export function homeCases(): Project[] {
  return HOME_CASE_SLUGS.map((slug) => getProject(slug)).filter(
    (p): p is Project => Boolean(p),
  );
}
