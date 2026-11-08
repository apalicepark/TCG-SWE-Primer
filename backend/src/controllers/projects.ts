import { Request, Response } from "express";
import { supabase } from "../app";

// Check section 1-2 in the README for more details on how to create this controller.

// Get project by ID
export const getProjectById = async (req: Request, res: Response) => {
    const projectId = req.params.id
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
    if (error) {
        console.error("Error fetching project by ID:", error);
        return res.status(500).json({ error: "Failed to fetch project" });
    }
    return res.json(data)
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
}

// Create a new project
export const createProject = async (req: Request, res: Response) => {
    const { name, managerId, description } = req.body;
    // error handling: missing required fields
    if (!name || managerId === undefined) { 
        return res.status(400).json({ error: "name and managerId are required" });
    }

    const managerExists = await checkUserExists(managerId);
    if (!managerExists) {
        return res.status(404).json({ error: `User ${managerId} not found` });
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
    
    // error handling
    if (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ error: "Failed to create project" });
    }

    // successful POST that made something new
    return res.status(201).json(data);
}

// Update a project

// Delete a project