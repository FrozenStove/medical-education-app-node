import { ChromaCheckResult } from "./checkChroma";
import { IngestResult } from "./ingestArticles";
import { VerificationResult } from "./verifyIngestion";

export type ScriptName = 'ingest' | 'verify' | 'check';

export type ScriptResult = {
    scriptName: ScriptName;
    result: string;
    error?: string;
}


export type IngestScriptResult = ScriptResult & {
    scriptName: 'ingest';
    result: IngestResult;
}

export type VerifyScriptResult = ScriptResult & {
    scriptName: 'verify';
    result: VerificationResult;
}

export type CheckScriptResult = ScriptResult & {
    scriptName: 'check';
    result: ChromaCheckResult;
}