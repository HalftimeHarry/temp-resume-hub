<script lang="ts">
  import type { Resume } from '$lib/types/resume';
  import { Badge } from '$lib/components/ui/badge';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
  import { Separator } from '$lib/components/ui/separator';
  import { 
    Mail, 
    Phone, 
    MapPin, 
    Globe, 
    Linkedin, 
    Github,
    Calendar,
    Building,
    GraduationCap,
    Award
  } from 'lucide-svelte';
  
  export let resume: Resume;
  
  // Safely access settings from either resume.settings or resume.content.settings
  $: settings = resume.settings || resume.content?.settings || {
    showProfileImage: false,
    colorScheme: 'blue',
    fontSize: 'medium',
    spacing: 'normal'
  };
  
  // Safely access content data
  $: personalInfo = resume.personalInfo || resume.content?.personalInfo || {};
  $: summary = resume.summary || resume.content?.summary || '';
  $: experience = resume.experience || resume.content?.experience || [];
  $: education = resume.education || resume.content?.education || [];
  $: skills = resume.skills || resume.content?.skills || [];
  $: projects = resume.projects || resume.content?.projects || [];
  $: sections = resume.sections || [];
  
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
  
  function getDateRange(startDate: string, endDate?: string, current?: boolean): string {
    const start = formatDate(startDate);
    if (current) return `${start} - Present`;
    if (endDate) return `${start} - ${formatDate(endDate)}`;
    return start;
  }
  
  function getInitials(name: string): string {
    if (!name) return 'UN';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  
  function getLevelColor(level: string): string {
    switch (level) {
      case 'beginner': return 'bg-red-100 text-red-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  function getProficiencyColor(proficiency: string): string {
    switch (proficiency) {
      case 'basic': return 'bg-red-100 text-red-800';
      case 'conversational': return 'bg-yellow-100 text-yellow-800';
      case 'fluent': return 'bg-blue-100 text-blue-800';
      case 'native': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  // Filter visible sections and sort by order
  $: visibleSections = sections
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);
</script>

<div class="max-w-4xl mx-auto bg-white p-4 md:p-8 shadow-sm" style="min-height: 11in;">
  <!-- Header -->
  <header class="mb-6 md:mb-8">
    <div class="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
      <!-- Profile Image -->
      {#if settings.showProfileImage && personalInfo.profileImage}
        <div class="flex-shrink-0">
          <Avatar class="h-24 w-24">
            <AvatarImage src={personalInfo.profileImage} alt={personalInfo.fullName} />
            <AvatarFallback class="text-xl">
              {getInitials(personalInfo.fullName)}
            </AvatarFallback>
          </Avatar>
        </div>
      {/if}
      
      <!-- Personal Info -->
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {personalInfo.fullName}
        </h1>
        
        <!-- Contact Information -->
        <div class="space-y-1 text-sm text-gray-600 mb-4">
          {#if personalInfo.email}
            <div class="flex items-start space-x-2">
              <Mail class="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <span class="font-medium">Email:</span>
                <span> {personalInfo.email}</span>
              </div>
            </div>
          {/if}
          
          {#if personalInfo.phone}
            <div class="flex items-start space-x-2">
              <Phone class="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <span class="font-medium">Phone:</span>
                <span> {personalInfo.phone}</span>
              </div>
            </div>
          {/if}
          
          {#if personalInfo.location}
            <div class="flex items-start space-x-2">
              <MapPin class="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <span class="font-medium">Location:</span>
                <span> {personalInfo.location}</span>
              </div>
            </div>
          {/if}
        </div>
        
        <!-- Links -->
        {#if personalInfo.website || personalInfo.linkedin || personalInfo.github}
          <div class="space-y-1 text-sm text-blue-600 mb-4">
            {#if personalInfo.website}
              <div class="flex items-start space-x-2">
                <Globe class="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span class="font-medium">Website:</span>
                  <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" class="ml-1">
                    {personalInfo.website?.replace(/^https?:\/\//, '') || personalInfo.website}
                  </a>
                </div>
              </div>
            {/if}
            
            {#if personalInfo.linkedin}
              <div class="flex items-start space-x-2">
                <Linkedin class="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span class="font-medium">LinkedIn:</span>
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" class="ml-1">
                    {personalInfo.linkedin}
                  </a>
                </div>
              </div>
            {/if}
            
            {#if personalInfo.github}
              <div class="flex items-start space-x-2">
                <Github class="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span class="font-medium">GitHub:</span>
                  <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" class="ml-1">
                    {personalInfo.github}
                  </a>
                </div>
              </div>
            {/if}
          </div>
        {/if}
        
        <!-- Professional Summary -->
        {#if summary || personalInfo.summary}
          <p class="text-gray-700 leading-relaxed">
            {summary || personalInfo.summary}
          </p>
        {/if}
      </div>
    </div>
  </header>
  
  <!-- Sections -->
  {#each visibleSections as section}
    {#if section.data.length > 0}
      <section class="mb-6 md:mb-8">
        <h2 class="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 pb-2 border-b border-gray-200">
          {section.title}
        </h2>
        
        <div class="space-y-4">
          {#if section.type === 'experience'}
            {#each section.data as experience}
              <div class="space-y-2">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-gray-900">{experience.position}</h3>
                    <div class="flex items-center space-x-2 text-gray-600">
                      <Building class="h-4 w-4" />
                      <span>{experience.company}</span>
                      {#if experience.location}
                        <span>•</span>
                        <span>{experience.location}</span>
                      {/if}
                    </div>
                  </div>
                  <div class="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar class="h-4 w-4" />
                    <span>{getDateRange(experience.startDate, experience.endDate, experience.current)}</span>
                  </div>
                </div>
                
                {#if experience.description}
                  <p class="text-gray-700 text-sm leading-relaxed">
                    {experience.description}
                  </p>
                {/if}
                
                {#if experience.highlights && experience.highlights.length > 0}
                  <ul class="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                    {#each experience.highlights as highlight}
                      <li>{highlight}</li>
                    {/each}
                  </ul>
                {/if}
              </div>
            {/each}
            
          {:else if section.type === 'education'}
            {#each section.data as education}
              <div class="space-y-2">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-gray-900">{education.degree}</h3>
                    <div class="flex items-center space-x-2 text-gray-600">
                      <GraduationCap class="h-4 w-4" />
                      <span>{education.institution}</span>
                      {#if education.field}
                        <span>•</span>
                        <span>{education.field}</span>
                      {/if}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar class="h-4 w-4" />
                      <span>{getDateRange(education.startDate, education.endDate, education.current)}</span>
                    </div>
                    {#if education.gpa}
                      <div class="text-sm text-gray-600">GPA: {education.gpa}</div>
                    {/if}
                  </div>
                </div>
                
                {#if education.description}
                  <p class="text-gray-700 text-sm leading-relaxed">
                    {education.description}
                  </p>
                {/if}
                
                {#if education.honors && education.honors.length > 0}
                  <div class="flex flex-wrap gap-2">
                    {#each education.honors as honor}
                      <Badge variant="secondary" class="text-xs">
                        <Award class="h-3 w-3 mr-1" />
                        {honor}
                      </Badge>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
            
          {:else if section.type === 'skills'}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
              {#each section.data as skill}
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="font-medium text-sm">{skill.name}</span>
                  <Badge class={getLevelColor(skill.level)} variant="secondary">
                    {skill.level}
                  </Badge>
                </div>
              {/each}
            </div>
            
          {:else if section.type === 'projects'}
            {#each section.data as project}
              <div class="space-y-2">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-gray-900">{project.name}</h3>
                    {#if project.technologies && project.technologies.length > 0}
                      <div class="flex flex-wrap gap-1 mt-1">
                        {#each project.technologies as tech}
                          <Badge variant="outline" class="text-xs">{tech}</Badge>
                        {/each}
                      </div>
                    {/if}
                  </div>
                  {#if project.startDate}
                    <div class="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar class="h-4 w-4" />
                      <span>{getDateRange(project.startDate, project.endDate)}</span>
                    </div>
                  {/if}
                </div>
                
                {#if project.description}
                  <p class="text-gray-700 text-sm leading-relaxed">
                    {project.description}
                  </p>
                {/if}
                
                {#if project.highlights && project.highlights.length > 0}
                  <ul class="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                    {#each project.highlights as highlight}
                      <li>{highlight}</li>
                    {/each}
                  </ul>
                {/if}
              </div>
            {/each}
            
          {:else if section.type === 'languages'}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
              {#each section.data as language}
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="font-medium text-sm">{language.name}</span>
                  <Badge class={getProficiencyColor(language.proficiency)} variant="secondary">
                    {language.proficiency}
                  </Badge>
                </div>
              {/each}
            </div>
            
          {:else}
            <!-- Generic section rendering for other types -->
            {#each section.data as item}
              <div class="space-y-2">
                <h3 class="font-semibold text-gray-900">
                  {item.title || item.name || 'Item'}
                </h3>
                {#if item.description}
                  <p class="text-gray-700 text-sm leading-relaxed">
                    {item.description}
                  </p>
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      </section>
    {/if}
  {/each}
</div>

<style>
  /* Print styles */
  @media print {
    .max-w-4xl {
      max-width: none;
      margin: 0;
      padding: 0.5in;
    }
  }
</style>