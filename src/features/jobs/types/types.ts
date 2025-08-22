export type Job = {
id: number;
title: string;
description: string;
location?: string;
createdAt?: string;
ownerId: number;
applicantsCount?: number;
};

export type OwnerFilter = "me" | "others" | "all";