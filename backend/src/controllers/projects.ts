import { Request, Response } from "express";
import { supabase } from "../app";

// Check section 1-2 in the README for more details on how to create this controller.

// Get project by ID
export const getProjectById = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
    if (error) {
        // .single() returns PGRST116 when no row matches -> project doesn't exist
        if (error.code === "PGRST116") {
            return res.status(404).json({ error: `Project ${projectId} not found` });
        }
        console.error("Error fetching project by ID:", error);
        return res.status(500).json({ error: "Failed to fetch project" });
    }
    return res.json(data);
};

// Get all projects
export const getAllProjects = async (_req: Request, res: Response) => {
    const { data, error } = await supabase
        .from("projects") // from projects table
        .select("*") // * means select all
        .order("id", { ascending: true });

    if (error) {
        console.error("Error fetching all projects:", error);
        return res.status(500).json({ error: "Failed to fetch projects" });
    }

    return res.json(data);
};

// Create a new project
export const createProject = async (req: Request, res: Response) => {
    const { name, managerId, description } = req.body;
    // error handling: missing required fields
    if (!name || managerId === undefined) {
        return res.status(400).json({ error: "name and managerId are required" });
    }

    const { data, error } = await supabase
        .from("projects")
        .insert({
            project_name: name,
            project_manager_id: managerId,
            project_description: description,
        })
        .select() // asks for new row back
        .single(); // gives object not array

    if (error) {
        // 23503 = foreign key violation -> managerId doesn't match any user
        if (error.code === "23503") {
            return res.status(404).json({ error: `User ${managerId} not found` });
        }
        console.error("Error creating project:", error);
        return res.status(500).json({ error: "Failed to create project" });
    }

    // successful POST that made something new
    return res.status(201).json(data);
};

// Update a project
export const updateProject = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const { name, managerId, description } = req.body;
    const updates: Record<string, unknown> = {};

    // only include fields that were actually sent
    if (name !== undefined) updates.project_name = name;
    if (description !== undefined) updates.project_description = description;
    if (managerId !== undefined) updates.project_manager_id = managerId;

    if (Object.keys(updates).length === 0) {
        return res
            .status(400)
            .json({ error: "Provide at least one of name, managerId, description" });
    }

    const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", projectId)
        .select()
        .single();

    if (error) {
        // no row matched -> project doesn't exist
        if (error.code === "PGRST116") {
            return res.status(404).json({ error: `Project ${projectId} not found` });
        }
        // foreign key violation -> new managerId doesn't match any user
        if (error.code === "23503") {
            return res.status(404).json({ error: `User ${managerId} not found` });
        }
        console.error("Error updating project:", error);
        return res.status(500).json({ error: "Failed to update project" });
    }
    return res.json(data);
};

// Delete a project
export const deleteProject = async (req: Request, res: Response) => {
    const projectId = req.params.id;

    const { data, error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId) // filter to prevent deletion of all projects
        .select(); // returns deleted rows

    if (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({ error: "Failed to delete project" });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({ error: `Project ${projectId} not found` });
    }

    return res.json({ message: `Project ${projectId} deleted`, project: data[0] });
};