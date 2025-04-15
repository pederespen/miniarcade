import {
  Airplane,
  Obstacle,
  CircleHitbox,
  RectHitbox,
  PlantHitbox,
  Point,
  LineSegment,
  Powerup,
} from "../types";

/**
 * Checks if a point is inside a rectangle
 */
export function pointInRectangle(point: Point, rect: RectHitbox): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * Calculates distance between a point and a circle center
 */
export function distance(point: Point, circle: CircleHitbox): number {
  return Math.sqrt(
    Math.pow(point.x - circle.x, 2) + Math.pow(point.y - circle.y, 2)
  );
}

/**
 * Gets appropriate hitbox for different obstacle types
 */
export function getObstacleHitbox(obstacle: Obstacle): RectHitbox {
  switch (obstacle.type) {
    case "drawer":
      return {
        x: obstacle.x + obstacle.width * 0.05,
        y: obstacle.y + obstacle.height * 0.15,
        width: obstacle.width * 0.9,
        height: obstacle.height * 0.6,
      };

    case "coffee":
      return {
        x: obstacle.x + obstacle.width * 0.25 - 2,
        y: obstacle.y + obstacle.height * 0.2,
        width: obstacle.width * 0.5 + 4,
        height: obstacle.height * 0.7,
      };

    case "monitor":
      return {
        x: obstacle.x + obstacle.width * 0.125,
        y: obstacle.y + obstacle.height * 0.125,
        width: obstacle.width * 0.75,
        height: obstacle.height * 0.7,
      };

    default:
      // Default slightly smaller hitbox for other objects
      return {
        x: obstacle.x + obstacle.width * 0.1,
        y: obstacle.y + obstacle.height * 0.1,
        width: obstacle.width * 0.8,
        height: obstacle.height * 0.8,
      };
  }
}

/**
 * Checks for line segment to line segment intersection
 */
export function lineLineIntersect(
  line1: LineSegment,
  line2: LineSegment
): boolean {
  const det =
    (line1.p2.x - line1.p1.x) * (line2.p2.y - line2.p1.y) -
    (line1.p2.y - line1.p1.y) * (line2.p2.x - line2.p1.x);

  if (det === 0) {
    return false; // Lines are parallel
  }

  const lambda =
    ((line2.p2.y - line2.p1.y) * (line2.p2.x - line1.p1.x) +
      (line2.p1.x - line2.p2.x) * (line2.p2.y - line1.p1.y)) /
    det;
  const gamma =
    ((line1.p1.y - line1.p2.y) * (line2.p2.x - line1.p1.x) +
      (line1.p2.x - line1.p1.x) * (line2.p2.y - line1.p1.y)) /
    det;

  return 0 <= lambda && lambda <= 1 && 0 <= gamma && gamma <= 1;
}

/**
 * Checks for line segment to rectangle intersection
 */
export function lineRectIntersect(
  edge: LineSegment,
  rect: RectHitbox
): boolean {
  // Rectangle edges
  const rectEdges: LineSegment[] = [
    // Top edge
    {
      p1: { x: rect.x, y: rect.y },
      p2: { x: rect.x + rect.width, y: rect.y },
    },
    // Right edge
    {
      p1: { x: rect.x + rect.width, y: rect.y },
      p2: { x: rect.x + rect.width, y: rect.y + rect.height },
    },
    // Bottom edge
    {
      p1: { x: rect.x, y: rect.y + rect.height },
      p2: { x: rect.x + rect.width, y: rect.y + rect.height },
    },
    // Left edge
    {
      p1: { x: rect.x, y: rect.y },
      p2: { x: rect.x, y: rect.y + rect.height },
    },
  ];

  // Check if the line segment intersects with any edge of the rectangle
  return rectEdges.some((rectEdge) => lineLineIntersect(edge, rectEdge));
}

/**
 * Checks for line segment to circle intersection
 */
export function lineCircleIntersect(
  edge: LineSegment,
  circle: CircleHitbox,
  radius: number
): boolean {
  // Vector from p1 to p2
  const v1 = { x: edge.p2.x - edge.p1.x, y: edge.p2.y - edge.p1.y };
  // Vector from p1 to circle center
  const v2 = { x: circle.x - edge.p1.x, y: circle.y - edge.p1.y };

  // Length of the line segment
  const segmentLength = Math.sqrt(v1.x * v1.x + v1.y * v1.y);

  // Unit vector of v1
  const v1Unit = { x: v1.x / segmentLength, y: v1.y / segmentLength };

  // Projection of v2 onto v1
  const projection = v2.x * v1Unit.x + v2.y * v1Unit.y;

  // Get the closest point on the line segment to the circle center
  let closestPoint: Point;

  if (projection < 0) {
    closestPoint = edge.p1;
  } else if (projection > segmentLength) {
    closestPoint = edge.p2;
  } else {
    closestPoint = {
      x: edge.p1.x + v1Unit.x * projection,
      y: edge.p1.y + v1Unit.y * projection,
    };
  }

  // Check if the closest point is within the radius of the circle
  const dist = Math.sqrt(
    Math.pow(closestPoint.x - circle.x, 2) +
      Math.pow(closestPoint.y - circle.y, 2)
  );

  return dist < radius;
}

/**
 * More accurate collision detection for airplane and obstacles
 */
export function checkCollision(plane: Airplane, obstacle: Obstacle): boolean {
  // Define the actual shape of the paper airplane as a triangle
  // with 3 points for more accurate collision detection
  const planeCenter = {
    x: plane.x + plane.width / 2,
    y: plane.y + plane.height / 2,
  };

  // Calculate the rotated triangle points of the paper airplane
  const angleRad = (plane.rotation * Math.PI) / 180;
  const cosAngle = Math.cos(angleRad);
  const sinAngle = Math.sin(angleRad);

  // Define the triangle points relative to center - making the triangle slightly larger
  // for better collision sensitivity
  const rightTip = {
    x: plane.width * 0.45, // Slightly larger tip (was 0.4)
    y: 0,
  };

  const topLeft = {
    x: -plane.width * 0.45, // Slightly larger left edge (was 0.4)
    y: -plane.height * 0.45, // Slightly larger top edge (was 0.4)
  };

  const bottomLeft = {
    x: -plane.width * 0.45, // Slightly larger left edge (was 0.4)
    y: plane.height * 0.45, // Slightly larger bottom edge (was 0.4)
  };

  // Rotate the points based on plane rotation
  const rotatePoint = (point: { x: number; y: number }) => {
    return {
      x: planeCenter.x + (point.x * cosAngle - point.y * sinAngle),
      y: planeCenter.y + (point.x * sinAngle + point.y * cosAngle),
    };
  };

  // Get actual points after rotation
  const p1 = rotatePoint(rightTip);
  const p2 = rotatePoint(topLeft);
  const p3 = rotatePoint(bottomLeft);

  // Get the triangle edges as line segments
  const edges: LineSegment[] = [
    { p1, p2 }, // Top edge
    { p1: p2, p2: p3 }, // Left edge
    { p1: p3, p2: p1 }, // Bottom edge
  ];

  // Handle different obstacle types with appropriate hitboxes
  switch (obstacle.type) {
    case "fan": {
      // For circular objects, we'll use a circular hitbox
      const radius = obstacle.width * 0.37;
      const center: CircleHitbox = {
        x: obstacle.x + obstacle.width / 2,
        y: obstacle.y + obstacle.height / 3,
        radius: radius,
      };

      // Circle vs. Triangle check - first do a rough bounding box check
      const roughCheck =
        planeCenter.x - plane.width / 2 < center.x + radius &&
        planeCenter.x + plane.width / 2 > center.x - radius &&
        planeCenter.y - plane.height / 2 < center.y + radius &&
        planeCenter.y + plane.height / 2 > center.y - radius;

      if (!roughCheck) return false;

      // Do a more accurate point-to-circle check
      const distanceToP1 = Math.sqrt(
        Math.pow(p1.x - center.x, 2) + Math.pow(p1.y - center.y, 2)
      );
      const distanceToP2 = Math.sqrt(
        Math.pow(p2.x - center.x, 2) + Math.pow(p2.y - center.y, 2)
      );
      const distanceToP3 = Math.sqrt(
        Math.pow(p3.x - center.x, 2) + Math.pow(p3.y - center.y, 2)
      );

      // Also check if any edge of the triangle intersects with the circle
      const edgeIntersection = edges.some((edge) =>
        lineCircleIntersect(edge, center, radius)
      );

      return (
        distanceToP1 < radius ||
        distanceToP2 < radius ||
        distanceToP3 < radius ||
        edgeIntersection
      );
    }

    case "plant": {
      // Upper part is circular, lower part is rectangular
      const plantHitbox: PlantHitbox = {
        pot: {
          x: obstacle.x + obstacle.width * 0.25,
          y: obstacle.y + obstacle.height * 0.5 + 5,
          width: obstacle.width * 0.5,
          height: obstacle.height * 0.5 - 5,
        },
        foliage: {
          x: obstacle.x + obstacle.width * 0.5,
          y: obstacle.y + obstacle.height * 0.3,
          radius: obstacle.width * 0.25,
        },
      };

      // Check collision with pot (rectangle)
      const potCollision =
        pointInRectangle(p1, plantHitbox.pot) ||
        pointInRectangle(p2, plantHitbox.pot) ||
        pointInRectangle(p3, plantHitbox.pot) ||
        edges.some((edge) => lineRectIntersect(edge, plantHitbox.pot));

      // Check collision with foliage (circle)
      const foliageCollision =
        distance(p1, plantHitbox.foliage) < plantHitbox.foliage.radius ||
        distance(p2, plantHitbox.foliage) < plantHitbox.foliage.radius ||
        distance(p3, plantHitbox.foliage) < plantHitbox.foliage.radius ||
        edges.some((edge) =>
          lineCircleIntersect(
            edge,
            plantHitbox.foliage,
            plantHitbox.foliage.radius
          )
        );

      return potCollision || foliageCollision;
    }

    case "coffee": {
      // Handle coffee mug with two parts: main body and handle
      // Main mug body (rectangle)
      const mugBody: RectHitbox = {
        x: obstacle.x + obstacle.width * 0.25 - 2,
        y: obstacle.y + obstacle.height * 0.2,
        width: obstacle.width * 0.5 + 4,
        height: obstacle.height * 0.7,
      };

      // Check collision with mug body
      const bodyCollision =
        pointInRectangle(p1, mugBody) ||
        pointInRectangle(p2, mugBody) ||
        pointInRectangle(p3, mugBody) ||
        edges.some((edge) => lineRectIntersect(edge, mugBody));

      // Mug handle (circular arc)
      const handleCenter: CircleHitbox = {
        x: obstacle.x + obstacle.width * 0.75 + 2,
        y: obstacle.y + obstacle.height * 0.5,
        radius: obstacle.width * 0.16,
      };

      // Check collision with handle
      const handleCollision =
        distance(p1, handleCenter) < handleCenter.radius ||
        distance(p2, handleCenter) < handleCenter.radius ||
        distance(p3, handleCenter) < handleCenter.radius ||
        edges.some((edge) =>
          lineCircleIntersect(edge, handleCenter, handleCenter.radius)
        );

      return bodyCollision || handleCollision;
    }

    case "monitor": {
      // Handle monitor with screen and stand
      // Monitor screen (main part)
      const screen: RectHitbox = {
        x: obstacle.x + obstacle.width * 0.125,
        y: obstacle.y + obstacle.height * 0.125,
        width: obstacle.width * 0.75,
        height: obstacle.height * 0.7,
      };

      // Monitor stand
      const stand: RectHitbox = {
        x: obstacle.x + obstacle.width * 0.5 - obstacle.width * 0.0625,
        y: obstacle.y + obstacle.height * 0.8,
        width: obstacle.width * 0.125,
        height: obstacle.height * 0.17,
      };

      // Check collision with screen
      const screenCollision =
        pointInRectangle(p1, screen) ||
        pointInRectangle(p2, screen) ||
        pointInRectangle(p3, screen) ||
        edges.some((edge) => lineRectIntersect(edge, screen));

      // Check collision with stand
      const standCollision =
        pointInRectangle(p1, stand) ||
        pointInRectangle(p2, stand) ||
        pointInRectangle(p3, stand) ||
        edges.some((edge) => lineRectIntersect(edge, stand));

      return screenCollision || standCollision;
    }

    default: {
      // For other obstacles, use a simplified rectangular hitbox
      const rectHitbox: RectHitbox = getObstacleHitbox(obstacle);

      // Check if any point of the triangle is inside the rectangle or
      // if any edge of the triangle intersects with the rectangle
      return (
        pointInRectangle(p1, rectHitbox) ||
        pointInRectangle(p2, rectHitbox) ||
        pointInRectangle(p3, rectHitbox) ||
        edges.some((edge) => lineRectIntersect(edge, rectHitbox))
      );
    }
  }
}

/**
 * Checks for collision between airplane and powerup
 */
export function checkPowerupCollision(
  plane: Airplane,
  powerup: Powerup
): boolean {
  if (powerup.collected) return false;

  // Use a simplified circular hitbox for powerups
  const powerupCenter = {
    x: powerup.x + powerup.width / 2,
    y: powerup.y + powerup.height / 2,
  };
  const powerupRadius = powerup.width / 2;

  // Use the same airplane triangle hitbox as in checkCollision
  const planeCenter = {
    x: plane.x + plane.width / 2,
    y: plane.y + plane.height / 2,
  };

  // Calculate the rotated triangle points of the paper airplane
  const angleRad = (plane.rotation * Math.PI) / 180;
  const cosAngle = Math.cos(angleRad);
  const sinAngle = Math.sin(angleRad);

  // Define the triangle points relative to center
  const rightTip = {
    x: plane.width * 0.45,
    y: 0,
  };

  const topLeft = {
    x: -plane.width * 0.45,
    y: -plane.height * 0.45,
  };

  const bottomLeft = {
    x: -plane.width * 0.45,
    y: plane.height * 0.45,
  };

  // Rotate the points based on plane rotation
  const rotatePoint = (point: { x: number; y: number }) => {
    return {
      x: planeCenter.x + (point.x * cosAngle - point.y * sinAngle),
      y: planeCenter.y + (point.x * sinAngle + point.y * cosAngle),
    };
  };

  // Get actual points after rotation
  const p1 = rotatePoint(rightTip);
  const p2 = rotatePoint(topLeft);
  const p3 = rotatePoint(bottomLeft);

  // Check if any point of the airplane is close enough to the powerup center
  const distanceToP1 = Math.sqrt(
    Math.pow(p1.x - powerupCenter.x, 2) + Math.pow(p1.y - powerupCenter.y, 2)
  );
  const distanceToP2 = Math.sqrt(
    Math.pow(p2.x - powerupCenter.x, 2) + Math.pow(p2.y - powerupCenter.y, 2)
  );
  const distanceToP3 = Math.sqrt(
    Math.pow(p3.x - powerupCenter.x, 2) + Math.pow(p3.y - powerupCenter.y, 2)
  );

  return (
    distanceToP1 < powerupRadius ||
    distanceToP2 < powerupRadius ||
    distanceToP3 < powerupRadius
  );
}
