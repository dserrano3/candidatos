import { RiLinkedinBoxFill } from '@remixicon/react'

function Footer() {
  return (
    <footer className="mt-10 pt-5 border-t border-slate-200 flex items-center gap-3 text-gray-400 text-sm">
      <img src="/daniel.jpeg" alt="Daniel Serrano" className="w-8 h-8 rounded-full object-cover shrink-0" />
      <span>Creado por Daniel Serrano</span>
      <a
        href="https://www.linkedin.com/in/daniel-serrano-91398043/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#0a66c2] transition-colors duration-200 flex items-center"
        aria-label="LinkedIn de Daniel Serrano"
      >
        <RiLinkedinBoxFill size={20} />
      </a>
    </footer>
  )
}

export default Footer
