export interface missingTypes {
  artifact: {
    id: number;
    node_id: string;
    /** The name of the artifact. */
    name: string;
    /** The size in bytes of the artifact. */
    size_in_bytes: number;
    url: string;
    archive_download_url: string;
    /** Whether or not the artifact has expired. */
    expired: boolean;
    created_at: string | null;
    expires_at: string | null;
    updated_at: string | null;
    workflow_run?: {
      id?: number
      repository_id?: number
      head_repository_id?: number
      head_branch?: string
      head_sha?: string
    } | null
  };
  artifacts: Array<missingTypes["artifact"]>
}

