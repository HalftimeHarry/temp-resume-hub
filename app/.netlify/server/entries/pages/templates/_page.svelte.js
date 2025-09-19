import { V as ensure_array_like, E as head, W as attr_class, I as escape_html, X as stringify, D as pop, A as push } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "clsx";
import "../../../chunks/state.svelte.js";
import { C as Card, a as Card_content } from "../../../chunks/card-content.js";
import { C as Card_header, a as Card_title, b as Card_description } from "../../../chunks/card-title.js";
function _page($$payload, $$props) {
  push();
  let selectedTemplate = null;
  let showModal = false;
  const templates = [
    {
      id: 1,
      name: "Modern Professional",
      description: "Clean and modern design perfect for tech professionals",
      category: "Professional",
      rating: 4.8,
      color: "blue"
    },
    {
      id: 2,
      name: "Creative Designer",
      description: "Bold and creative layout for designers and artists",
      category: "Creative",
      rating: 4.6,
      color: "purple"
    },
    {
      id: 3,
      name: "Executive Classic",
      description: "Traditional and elegant design for senior positions",
      category: "Executive",
      rating: 4.9,
      color: "gray"
    },
    {
      id: 4,
      name: "Minimalist",
      description: "Simple and clean design that focuses on content",
      category: "Minimalist",
      rating: 4.7,
      color: "green"
    },
    {
      id: 5,
      name: "Tech Specialist",
      description: "Perfect for software engineers and developers",
      category: "Professional",
      rating: 4.5,
      color: "indigo"
    },
    {
      id: 6,
      name: "Marketing Pro",
      description: "Eye-catching design for marketing professionals",
      category: "Creative",
      rating: 4.4,
      color: "pink"
    }
  ];
  function selectTemplate(template) {
    selectedTemplate = template;
    showModal = true;
  }
  const each_array = ensure_array_like(templates);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Templates - Digital Resume Hub</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gray-50"><div class="bg-white border-b"><div class="max-w-7xl mx-auto px-4 py-6"><div class="flex items-center justify-between"><div><h1 class="text-3xl font-bold text-gray-900">Resume Templates</h1> <p class="text-gray-600 mt-2">Choose from our collection of professional resume templates</p></div> <button class="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">← Back to Home</button></div></div></div> <div class="max-w-7xl mx-auto px-4 py-8"><div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let template = each_array[$$index];
    Card($$payload, {
      class: "hover:shadow-lg transition-shadow cursor-pointer",
      onclick: () => selectTemplate(template),
      children: ($$payload2) => {
        Card_header($$payload2, {
          class: "p-0",
          children: ($$payload3) => {
            $$payload3.out.push(`<div class="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-lg p-4 relative overflow-hidden"><div class="bg-white rounded shadow-sm h-full p-3 text-xs relative"><div class="border-b border-gray-200 pb-2 mb-2"><div${attr_class(`h-2 ${stringify(template.color === "blue" ? "bg-blue-600" : template.color === "purple" ? "bg-purple-600" : template.color === "gray" ? "bg-gray-600" : template.color === "green" ? "bg-green-600" : template.color === "indigo" ? "bg-indigo-600" : "bg-pink-600")} rounded mb-1`)}></div> <div class="h-1 bg-gray-300 rounded w-3/4 mb-1"></div> <div class="h-1 bg-gray-200 rounded w-1/2"></div></div> <div class="space-y-2"><div><div${attr_class(`h-1 ${stringify(template.color === "blue" ? "bg-blue-500" : template.color === "purple" ? "bg-purple-500" : template.color === "gray" ? "bg-gray-500" : template.color === "green" ? "bg-green-500" : template.color === "indigo" ? "bg-indigo-500" : "bg-pink-500")} rounded w-1/3 mb-1`)}></div> <div class="space-y-1"><div class="h-1 bg-gray-300 rounded"></div> <div class="h-1 bg-gray-300 rounded w-4/5"></div> <div class="h-1 bg-gray-300 rounded w-3/5"></div></div></div> <div><div${attr_class(`h-1 ${stringify(template.color === "blue" ? "bg-blue-500" : template.color === "purple" ? "bg-purple-500" : template.color === "gray" ? "bg-gray-500" : template.color === "green" ? "bg-green-500" : template.color === "indigo" ? "bg-indigo-500" : "bg-pink-500")} rounded w-1/4 mb-1`)}></div> <div class="space-y-1"><div class="h-1 bg-gray-300 rounded w-5/6"></div> <div class="h-1 bg-gray-300 rounded w-2/3"></div></div></div> <div><div${attr_class(`h-1 ${stringify(template.color === "blue" ? "bg-blue-500" : template.color === "purple" ? "bg-purple-500" : template.color === "gray" ? "bg-gray-500" : template.color === "green" ? "bg-green-500" : template.color === "indigo" ? "bg-indigo-500" : "bg-pink-500")} rounded w-1/5 mb-1`)}></div> <div class="grid grid-cols-2 gap-1"><div class="h-1 bg-gray-300 rounded"></div> <div class="h-1 bg-gray-300 rounded"></div> <div class="h-1 bg-gray-300 rounded"></div> <div class="h-1 bg-gray-300 rounded"></div></div></div></div> <div class="absolute top-1 right-1 bg-black bg-opacity-75 text-white px-1 py-0.5 rounded text-xs">${escape_html(template.name)}</div></div></div>`);
          },
          $$slots: { default: true }
        });
        $$payload2.out.push(`<!----> `);
        Card_content($$payload2, {
          class: "p-4",
          children: ($$payload3) => {
            $$payload3.out.push(`<div class="flex items-start justify-between mb-2">`);
            Card_title($$payload3, {
              class: "text-lg",
              children: ($$payload4) => {
                $$payload4.out.push(`<!---->${escape_html(template.name)}`);
              },
              $$slots: { default: true }
            });
            $$payload3.out.push(`<!----> <div class="flex items-center text-sm text-yellow-600"><svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> ${escape_html(template.rating)}</div></div> `);
            Card_description($$payload3, {
              class: "text-sm mb-3",
              children: ($$payload4) => {
                $$payload4.out.push(`<!---->${escape_html(template.description)}`);
              },
              $$slots: { default: true }
            });
            $$payload3.out.push(`<!----> <div class="flex items-center justify-between"><span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${escape_html(template.category)}</span> <button class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">Use Template</button></div>`);
          },
          $$slots: { default: true }
        });
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    });
  }
  $$payload.out.push(`<!--]--></div> <div class="text-center mt-12">`);
  Card($$payload, {
    class: "max-w-2xl mx-auto",
    children: ($$payload2) => {
      Card_content($$payload2, {
        class: "p-8",
        children: ($$payload3) => {
          $$payload3.out.push(`<h2 class="text-2xl font-bold mb-4">Ready to Get Started?</h2> <p class="text-gray-600 mb-6">Create your account to access all templates and start building your professional resume.</p> <button class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">Get Started Free</button>`);
        },
        $$slots: { default: true }
      });
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div></div> `);
  if (showModal && selectedTemplate) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden" role="document"><div class="flex items-center justify-between p-6 border-b"><div><h2 id="modal-title" class="text-2xl font-bold">${escape_html(selectedTemplate.name)}</h2> <p class="text-gray-600">${escape_html(selectedTemplate.description)}</p></div> <button class="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center">×</button></div> <div class="p-6 overflow-y-auto max-h-[70vh]"><div class="grid md:grid-cols-2 gap-8"><div class="space-y-4"><h3 class="text-lg font-semibold">Preview</h3> <div class="bg-gray-50 rounded-lg p-6 aspect-[8.5/11]"><div class="bg-white rounded shadow-lg h-full p-6 text-sm overflow-hidden"><div${attr_class(`border-b-2 ${stringify(selectedTemplate.color === "blue" ? "border-blue-600" : selectedTemplate.color === "purple" ? "border-purple-600" : selectedTemplate.color === "gray" ? "border-gray-600" : selectedTemplate.color === "green" ? "border-green-600" : selectedTemplate.color === "indigo" ? "border-indigo-600" : "border-pink-600")} pb-4 mb-6`)}><h1${attr_class(`text-2xl font-bold ${stringify(selectedTemplate.color === "blue" ? "text-blue-900" : selectedTemplate.color === "purple" ? "text-purple-900" : selectedTemplate.color === "gray" ? "text-gray-900" : selectedTemplate.color === "green" ? "text-green-900" : selectedTemplate.color === "indigo" ? "text-indigo-900" : "text-pink-900")}`)}>John Doe</h1> <p class="text-gray-600 text-lg">Software Engineer</p> <div class="flex flex-wrap gap-4 mt-2 text-sm text-gray-500"><span>john.doe@email.com</span> <span>+1 (555) 123-4567</span> <span>San Francisco, CA</span></div></div> <div class="mb-6"><h2${attr_class(`text-lg font-semibold ${stringify(selectedTemplate.color === "blue" ? "text-blue-800" : selectedTemplate.color === "purple" ? "text-purple-800" : selectedTemplate.color === "gray" ? "text-gray-800" : selectedTemplate.color === "green" ? "text-green-800" : selectedTemplate.color === "indigo" ? "text-indigo-800" : "text-pink-800")} mb-3`)}>Experience</h2> <div class="space-y-4"><div><div class="flex justify-between items-start"><div><h3 class="font-semibold">Senior Software Engineer</h3> <p class="text-gray-600">Tech Company Inc.</p></div> <span class="text-sm text-gray-500">2021 - Present</span></div> <ul class="mt-2 text-sm text-gray-700 space-y-1"><li>• Led development of scalable web applications</li> <li>• Improved system performance by 40%</li> <li>• Mentored junior developers</li></ul></div></div></div> <div class="mb-6"><h2${attr_class(`text-lg font-semibold ${stringify(selectedTemplate.color === "blue" ? "text-blue-800" : selectedTemplate.color === "purple" ? "text-purple-800" : selectedTemplate.color === "gray" ? "text-gray-800" : selectedTemplate.color === "green" ? "text-green-800" : selectedTemplate.color === "indigo" ? "text-indigo-800" : "text-pink-800")} mb-3`)}>Skills</h2> <div class="flex flex-wrap gap-2"><span class="px-3 py-1 bg-gray-100 rounded-full text-sm">JavaScript</span> <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">React</span> <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Node.js</span> <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Python</span></div></div> <div><h2${attr_class(`text-lg font-semibold ${stringify(selectedTemplate.color === "blue" ? "text-blue-800" : selectedTemplate.color === "purple" ? "text-purple-800" : selectedTemplate.color === "gray" ? "text-gray-800" : selectedTemplate.color === "green" ? "text-green-800" : selectedTemplate.color === "indigo" ? "text-indigo-800" : "text-pink-800")} mb-3`)}>Education</h2> <div><div class="flex justify-between items-start"><div><h3 class="font-semibold">Bachelor of Computer Science</h3> <p class="text-gray-600">University of Technology</p></div> <span class="text-sm text-gray-500">2015 - 2019</span></div></div></div></div></div></div> <div class="space-y-6"><div><h3 class="text-lg font-semibold mb-3">Template Details</h3> <div class="space-y-3"><div class="flex items-center justify-between"><span class="text-gray-600">Category:</span> <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${escape_html(selectedTemplate.category)}</span></div> <div class="flex items-center justify-between"><span class="text-gray-600">Rating:</span> <div class="flex items-center"><span class="text-yellow-500">★★★★★</span> <span class="ml-2 text-sm text-gray-600">${escape_html(selectedTemplate.rating)}/5</span></div></div> <div class="flex items-center justify-between"><span class="text-gray-600">Best for:</span> <span class="text-sm">${escape_html(selectedTemplate.category)} roles</span></div></div></div> <div><h3 class="text-lg font-semibold mb-3">Features</h3> <ul class="space-y-2 text-sm text-gray-700"><li class="flex items-center"><svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Professional layout and typography</li> <li class="flex items-center"><svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> ATS-friendly format</li> <li class="flex items-center"><svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Customizable colors and sections</li> <li class="flex items-center"><svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> PDF export ready</li></ul></div> <div class="space-y-3"><button class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">Use This Template</button> <button class="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">Continue Browsing</button></div></div></div></div></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
export {
  _page as default
};
