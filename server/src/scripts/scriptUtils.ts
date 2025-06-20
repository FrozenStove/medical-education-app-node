
export type ScriptName = 'ingest' | 'verify' | 'check';

export type ScriptResult = {
    scriptName: ScriptName;
    documentCount: number;
    successfulFiles: number;
    failedFiles: number;
    data: any;
    error?: string;
}
