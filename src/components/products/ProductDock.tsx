import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import type { Project, ProjectCategory } from '../../types/bonku';
import { ProductPreview } from './ProductPreview';
import { AnimatedSauceSlideBackground } from './AnimatedSauceSlideBackground';

interface ProductDockProps {
  projects: Project[];
  selectedCategory: ProjectCategory;
  onSelectCategory: (category: ProjectCategory) => void;
  onSelectProject: (project: Project) => void;
}

export const ProductDock: React.FC<ProductDockProps> = ({
  projects,
  selectedCategory,
  onSelectCategory,
  onSelectProject
}) => {
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || '');

  const categories: { id: ProjectCategory; label: string; count: number }[] = [
      { id: 'all', label: 'Semua Produk', count: projects.length },
      {
        id: 'abon',
        label: 'Abon Ayam',
        count: projects.filter((p) => p.category === 'abon').length
      },
      {
        id: 'roti',
        label: 'Roti Isi Abon',
        count: projects.filter((p) => p.category === 'roti').length
      }
    ];

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  // synchronize currently active project selection
  const activeProject =
    filteredProjects.find((p) => p.id === activeProjectId) || filteredProjects[0] || projects[0];

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col justify-start sm:justify-between overflow-hidden select-none">
      {/* latar saus bumbu */}
      <AnimatedSauceSlideBackground depthLevel={4} />

      {/* category and project filter navigation */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-20 sm:pt-24 px-4 sm:px-12 flex flex-col gap-2 sm:gap-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <div>
            <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider text-[#2a1710] bg-[#fde047] px-2 py-0.5 sm:px-3 sm:py-0.5 rounded-lg border-2 border-[#2a1710] shadow-[2px_2px_0px_#2a1710] inline-block mb-1">
                          01 // KATALOG PRODUK
                        </span>
                        <h3 className="text-lg sm:text-2xl font-black text-[#2a1710] tracking-tight bg-[#fffdf5] border-2 border-[#2a1710] shadow-[2.5px_2.5px_0px_#2a1710] sm:shadow-[3px_3px_0px_#2a1710] rounded-xl px-2.5 py-1 sm:px-3.5 sm:py-1.5 w-fit">
                                                  Pilih Produk BonKu
                                                </h3>
          </div>

          {/* category selection */}
          <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            {categories.map((cat) => {
              const shortLabel =
                              cat.id === 'all' ? 'Semua' : cat.id === 'abon' ? 'Abon' : 'Roti';

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.id);
                    const nextFiltered =
                      cat.id === 'all' ? projects : projects.filter((p) => p.category === cat.id);
                    if (nextFiltered[0]) setActiveProjectId(nextFiltered[0].id);
                  }}
                  className={`flex items-center justify-center gap-1.5 px-2 py-2 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-mono font-black transition-all cursor-pointer border-2 border-[#2a1710] w-full sm:w-auto shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[#e2571a] text-white shadow-[2px_2px_0px_#2a1710] sm:shadow-[3px_3px_0px_#2a1710] -translate-y-0.5'
                      : 'bg-[#fffdf5] hover:bg-[#fdf3e3] text-[#2a1710] shadow-[1.5px_1.5px_0px_#2a1710] sm:shadow-[2px_2px_0px_#2a1710]'
                  }`}
                >
                  <span className="sm:hidden">{shortLabel}</span>
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span
                    className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      selectedCategory === cat.id
                        ? 'bg-white/30 text-white'
                        : 'bg-[#fdf3e3] text-[#2a1710] border border-[#2a1710]/40'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar py-0.5 w-full shrink-0">
          {filteredProjects.map((project, idx) => {
            const isSelected = activeProject.id === project.id;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => setActiveProjectId(project.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#2a1710] text-xs font-mono transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#fde047] text-[#2a1710] shadow-[2.5px_2.5px_0px_#2a1710] font-black -translate-y-0.5'
                    : 'bg-[#fffdf5]/95 hover:bg-[#fdf3e3] text-[#2a1710] shadow-[1.5px_1.5px_0px_#2a1710] font-bold'
                }`}
              >
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-[#2a1710]/10">
                  0{idx + 1}
                </span>
                <span>{project.title}</span>
                                {project.orderUrl ? (
                                  <ShoppingBag className="w-3 h-3 text-[#15803d]" />
                                ) : (
                                  <ExternalLink className="w-3 h-3 text-[#15803d]" />
                                )}
                              </button>
            );
          })}
        </div>
      </div>

      {/* project inspection stage */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-12 mt-2 sm:mt-auto sm:my-auto flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-5 items-stretch lg:items-center">
        {/* desktop project selector */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#e2571a] scrollbar-track-[#fffdf5]/50">
          {filteredProjects.map((project, idx) => {
            const isSelected = activeProject.id === project.id;

            return (
              <motion.div
                key={project.id}
                whileHover={{ x: 4 }}
                onClick={() => setActiveProjectId(project.id)}
                className={`p-3 sm:p-3.5 rounded-[20px] border-2 border-[#2a1710] cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#fde047] shadow-[4px_4px_0px_#2a1710] -translate-y-0.5'
                    : 'bg-[#fffdf5]/95 hover:bg-[#fdf3e3] shadow-[2px_2px_0px_#2a1710]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black text-[#2a1710] bg-[#fffdf5] px-1.5 py-0.5 rounded-md border border-[#2a1710]">
                      0{idx + 1}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#e2571a]">
                                          {project.category === 'abon' ? 'Abon Ayam' : 'Roti Isi Abon'}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <span className="text-[9px] font-mono font-bold text-[#15803d] bg-[#dcfce7] px-1.5 py-0.5 rounded-md border border-[#16a34a]/40 flex items-center gap-1">
                                          <ShoppingBag className="w-2.5 h-2.5" />
                                          <span>Bisa Dipesan</span>
                                        </span>
                                      </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-[#2a1710] leading-tight">
                      {project.title}
                    </h4>
                    <p className="text-[10px] font-mono font-bold text-[#7a4a1d] mt-0.5">
                      {project.metrics[0]?.value} • {project.metrics[1]?.value}
                    </p>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border border-[#2a1710] transition-transform ${
                      isSelected ? 'bg-[#e2571a] text-white rotate-90' : 'bg-[#fffdf5] text-[#2a1710]'
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* project inspection display */}
        <div className="w-full lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="p-3.5 sm:p-5 rounded-2xl sm:rounded-[24px] bg-[#fffdf5] border-2 border-[#2a1710] shadow-[4px_4px_0px_#2a1710] sm:shadow-[6px_6px_0px_#2a1710] flex flex-col justify-between space-y-2.5 sm:space-y-3"
            >
              {/* project preview frame */}
              <div className="space-y-2 sm:space-y-2">
                <ProductPreview
                                  project={activeProject}
                                  className="h-[210px] min-[400px]:h-[235px] sm:h-auto sm:aspect-[16/9] sm:max-h-[220px] lg:max-h-none w-full"
                                />

                {/* project titles with generous breathing room */}
                <div className="pt-2 sm:pt-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base sm:text-xl font-black text-[#2a1710]">
                      {activeProject.title}
                    </h4>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#e2571a] bg-[#fce7c8] px-2 py-0.5 rounded-lg border border-[#e2571a]/40 shrink-0">
                      {activeProject.role}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-mono font-bold text-[#7a4a1d] mt-0.5 line-clamp-1">
                    {activeProject.subtitle}
                  </p>
                </div>

                <p className="text-[11px] sm:text-xs text-[#334155] leading-relaxed font-medium line-clamp-2">
                  {activeProject.summary}
                </p>
              </div>

              {/* performance (desktop) */}
              <div className="hidden sm:grid grid-cols-3 gap-1.5 sm:gap-2">
                {activeProject.metrics.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-[#fdf3e3] border border-[#2a1710]/50 text-center shadow-[1.5px_1.5px_0px_#2a1710] sm:shadow-[2px_2px_0px_#2a1710]"
                  >
                    <div className="text-[8px] sm:text-[9px] font-mono font-bold uppercase text-[#7a4a1d] leading-tight">
                      {m.label}
                    </div>
                    <div className="text-[10px] sm:text-xs font-black text-[#2a1710] mt-0.5 leading-tight">
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* case study modal button */}
              <div className="pt-1.5 sm:pt-2 border-t border-[#e3cfae] flex items-center justify-between gap-2 sm:gap-3">
                <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                  {activeProject.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-[#fffdf5] text-[10px] font-mono font-bold text-[#2a1710] border border-[#2a1710]/40"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectProject(activeProject)}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl bg-[#e2571a] hover:bg-[#b2430f] text-white text-[11px] sm:text-xs font-mono font-black border-2 border-[#2a1710] shadow-[2.5px_2.5px_0px_#2a1710] sm:shadow-[3px_3px_0px_#2a1710] cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                                    <span>Lihat Detail &amp; Pesan</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* jarak dasar meja */}
      <div className="relative z-10 hidden sm:block sm:h-20 w-full shrink-0" />
    </div>
  );
};
