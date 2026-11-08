"use client";

import { useEffect, useState } from "react";

import { getAllProjects, type Project } from "../../api/projects";
import { getAssociatesByProjectId } from "../../api/associates";
import { getUserById } from "../../api/users";
import styles from "./project_display.module.css";

type ProjectDisplayProps = {
	refreshTrigger?: number;
};

export default function ProjectDisplay({ refreshTrigger = 0 }: ProjectDisplayProps) {
	{/* TODO: implement in part 2.3 */}

	return (
		<div className={styles.tableWrap}>
			{/* className (not class) is how React applies CSS classes */}
			<table className={styles.table}>
				{/* thead = header section of the table */}
				<thead className={styles.head}>
					{/* tr = table row */}
					<tr>
						{/* th = header cell */}
						<th className={styles.cell}>ID</th>
						<th className={styles.cell}>Project Name</th>
						<th className={styles.cell}>Manager</th>
						<th className={styles.cell}>Associates</th>
						<th className={styles.cell}>Description</th>
					</tr>
				</thead>

				{/* tbody = the data rows. These are placeholders for now;
				    in part 2.3 you'll replace them with projects.map(...) */}
				<tbody>
					<tr>
						{/* td = regular data cell */}
						<td className={styles.cell}>1</td>
						<td className={styles.cell}>Example Project</td>
						<td className={styles.cell}>Alice</td>
						<td className={styles.cell}>Bob, Charlie</td>
						<td className={styles.cell}>A sample project description</td>
					</tr>
					<tr>
						<td className={styles.cell}>2</td>
						<td className={styles.cell}>Another Project</td>
						<td className={styles.cell}>Dana</td>
						<td className={styles.cell}>None</td>
						<td className={styles.cell}>Placeholder row for styling</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}