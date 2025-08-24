export interface JobDTO {
	title: Job['title'];
	description: Job['description'];
	ownerId: Job['ownerId'];
	id?: Job['id'];
}

export class Job {
	private constructor(
		readonly title: string,
		readonly description: string,
		readonly ownerId: number,
		readonly id?: number
	) {}

	static fromPayload(data: JobDTO): Job {
		return new Job(data.title, data.description, data.ownerId, data?.id);
	}

	static create(data: Required<Pick<JobDTO, 'title' | 'description' | 'ownerId'>>): Job {
		return this.fromPayload(data);
	}

	toJson(): JobDTO {
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			ownerId: this.ownerId,
		};
	}
}
