// IAM Policy structure interfaces
// Validates IAM Policy JSON
export function validatePolicy(policyJson) {
  try {
    const policy = JSON.parse(policyJson);
    
    // Basic structure validation
    if (!policy.Version) {
      return { valid: false, error: 'Missing "Version" field in policy' };
    }
    
    if (!policy.Statement || !Array.isArray(policy.Statement)) {
      return { valid: false, error: 'Missing or invalid "Statement" array in policy' };
    }
    
    for (const statement of policy.Statement) {
      if (!statement.Effect || (statement.Effect !== "Allow" && statement.Effect !== "Deny")) {
        return { valid: false, error: 'Statement missing valid "Effect" (must be "Allow" or "Deny")' };
      }
      
      if (!statement.Action && !statement.NotAction) {
        return { valid: false, error: 'Statement missing "Action" or "NotAction" field' };
      }
      
      if (!statement.Resource && !statement.NotResource) {
        return { valid: false, error: 'Statement missing "Resource" or "NotResource" field' };
      }
    }
    
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Invalid JSON format' 
    };
  }
}

// Generate summary of IAM Policy
export function generatePolicySummary(policyJson) {
  try {
    const policy = JSON.parse(policyJson);
    const statements = [];
    
    let totalActions = 0;
    let totalResources = 0;
    let allowCount = 0;
    let denyCount = 0;
    
    for (const statement of policy.Statement) {
      const effect = statement.Effect;
      const actions = Array.isArray(statement.Action) ? statement.Action : [statement.Action];
      const resources = Array.isArray(statement.Resource) ? statement.Resource : [statement.Resource];
      
      totalActions += actions.length;
      totalResources += resources.length;
      
      if (effect === "Allow") {
        allowCount++;
      } else {
        denyCount++;
      }
      
      statements.push({
        effect,
        actions,
        resources,
        conditions: statement.Condition
      });
    }
    
    return {
      version: policy.Version,
      statementCount: policy.Statement.length,
      actionCount: totalActions,
      resourceCount: totalResources,
      allowCount,
      denyCount,
      statements
    };
  } catch (error) {
    console.error("Error generating policy summary:", error);
    return null;
  }
}

// Extract service from an action
export function extractServiceFromAction(action) {
  const parts = action.split(':');
  return parts[0];
}

// Extract resource name from ARN
export function extractResourceName(resource) {
  // Handle wildcard resources
  if (resource === "*") return "*";
  
  // Extract the resource name from ARN
  const parts = resource.split(':');
  if (parts.length < 6) return resource;
  
  const resourcePart = parts[5];
  const segments = resourcePart.split('/');
  
  // Return the last meaningful segment
  return segments[segments.length - 1] || resourcePart;
}

// Build a resource tree for visualization
export function buildResourceTree(policy) {
  if (!policy) return [];
  
  // Group resources by service
  const serviceMap = {};
  
  policy.statements.forEach(statement => {
    statement.resources.forEach(resource => {
      // Skip resources that are just "*"
      if (resource === "*") return;
      
      // Get service from resource ARN
      const parts = resource.split(':');
      const service = parts[2] || "unknown";
      
      if (!serviceMap[service]) {
        serviceMap[service] = {
          name: service.toUpperCase(),
          type: "service",
          isAllowed: statement.effect === "Allow",
          actions: [],
          children: []
        };
      }
      
      // Extract bucket or table name
      const resourceName = extractResourceName(resource);
      
      // Check if we already have this resource
      let resourceNode = serviceMap[service].children?.find(r => r.name === resourceName);
      
      if (!resourceNode) {
        resourceNode = {
          name: resourceName,
          type: "resource",
          isAllowed: statement.effect === "Allow",
          actions: [],
          children: []
        };
        serviceMap[service].children?.push(resourceNode);
      }
      
      // Add the actions to this resource
      statement.actions.forEach(action => {
        if (!resourceNode?.actions.includes(action)) {
          resourceNode?.actions.push(action);
        }
      });
    });
  });
  
  return Object.values(serviceMap);
}

// Syntax highlighting for JSON
export function highlightJSON(json) {
  return json
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
          match = match.replace(/:$/, '');
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return `<span class="${cls}">${match}</span>`;
    });
}