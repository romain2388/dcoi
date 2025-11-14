export const getConclusionColor = (conclusion?: string) => {
  switch (conclusion?.toLowerCase()) {
    case "success": {
      return "status-ok";
    }
    case "failure": {
      return "status-error";
    }
    case "cancelled": {
      return "status-warning";
    }
    default: {
      return "status-unknown";
    }
  }
};
