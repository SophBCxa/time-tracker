import { useState, useCallback, useEffect } from 'react';
import { Project, createProject } from '../domain/Project';
import { ProjectApi } from '../services/projectApi';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    const [projs, typs] = await Promise.all([ProjectApi.getAll(), ProjectApi.getTypes()]);
    setProjects(projs);
    setTypes(typs);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addProject = useCallback(
    async (data: Omit<Project, 'id'>) => {
      await ProjectApi.add(createProject(data));
      await refresh();
    },
    [refresh]
  );

  const updateProject = useCallback(
    async (project: Project) => {
      await ProjectApi.update(project);
      await refresh();
    },
    [refresh]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      await ProjectApi.delete(id);
      await refresh();
    },
    [refresh]
  );

  const addType = useCallback(
    async (type: string) => {
      await ProjectApi.addType(type);
      await refresh();
    },
    [refresh]
  );

  const deleteType = useCallback(
    async (type: string) => {
      await ProjectApi.deleteType(type);
      await refresh();
    },
    [refresh]
  );

  return { projects, types, addProject, updateProject, deleteProject, addType, deleteType };
}
