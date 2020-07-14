
export type WorkflowElement = { name: string;
  description: string;
  ui: JSX.Element | string | null;
  child?: any;
  steps: Array<string>;};

export type WorkflowType = {
 [name:string] : WorkflowElement
};

 const workflows : WorkflowType = {"COMPRESS-TRANSCODE":{"name":"Compress-Transcode","description":"Workflow to compress and transcode your videos","steps":["COMPRESS","TRANSCODE"],"ui":null,"child":null}}; export default workflows;