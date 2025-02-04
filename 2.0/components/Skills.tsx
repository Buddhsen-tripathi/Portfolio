import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript,
  SiTailwindcss, SiNodedotjs, SiExpress, SiMongodb,
  SiAngular,
  SiCplusplus,
  SiDocker,
  SiFlask,
  SiGooglecloud,
  SiJenkins,
  SiKubernetes,
  SiMysql,
  SiNestjs,
  SiPostgresql,
  SiPython,
  SiSupabase,
} from 'react-icons/si'

import { FaJava } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";

export default function Skills() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Skills</h2>
      <div className="flex flex-wrap gap-4">
  {/* 🚀 High Priority (Core Technologies) */}
  <SiReact className="w-12 h-12" title="React" />
  <SiNextdotjs className="w-12 h-12" title="Next.js" />
  <SiTypescript className="w-12 h-12" title="TypeScript" />
  <SiJavascript className="w-12 h-12" title="JavaScript" />
  <SiTailwindcss className="w-12 h-12" title="Tailwind CSS" />
  <SiNodedotjs className="w-12 h-12" title="Node.js" />
  <SiNestjs className="w-12 h-12" title="NestJS" />
  <SiMongodb className="w-12 h-12" title="MongoDB" />
  <SiPostgresql className="w-12 h-12" title="PostgreSQL" />
  <SiMysql className="w-12 h-12" title="MySQL" />

  <SiAngular className="w-12 h-12" title="Angular" />
  <SiFlask className="w-12 h-12" title="Flask" />
  <SiExpress className="w-12 h-12" title="Express" />
  <SiSupabase className="w-12 h-12" title="Supabase" />
  <SiDocker className="w-12 h-12" title="Docker" />
  <SiKubernetes className="w-12 h-12" title="Kubernetes" />
  <SiGooglecloud className="w-12 h-12" title="Google Cloud Platform" />
  <VscAzure className="w-12 h-12" title="Azure" />
  <SiJenkins className="w-12 h-12" title="Jenkins" />

  <FaJava className="w-12 h-12" title="Java" />
  <SiPython className="w-12 h-12" title="Python" />
  <SiCplusplus className="w-12 h-12" title="C++" />
</div>

    </section>
  )
}
