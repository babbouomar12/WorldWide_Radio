/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.130
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import {
  FrustumGeometry_default,
  OrthographicFrustum_default,
  PerspectiveFrustum_default
} from "./chunk-AEGAQ6FD.js";
import "./chunk-EXEZHW3P.js";
import "./chunk-GS55WTRX.js";
import {
  GeometryAttributes_default
} from "./chunk-F4ZAKN4V.js";
import {
  GeometryAttribute_default,
  Geometry_default,
  PrimitiveType_default
} from "./chunk-NWSAYFZG.js";
import {
  BoundingSphere_default
} from "./chunk-J4MAVE6J.js";
import {
  Quaternion_default
} from "./chunk-W6CPO62M.js";
import {
  ComponentDatatype_default
} from "./chunk-UK33ZN4K.js";
import {
  Cartesian3_default
} from "./chunk-VGJSKEIB.js";
import "./chunk-NR7KSD56.js";
import "./chunk-5OL6XFNS.js";
import "./chunk-HS76VTVY.js";
import {
  Check_default
} from "./chunk-WYCR5DWQ.js";
import {
  defined_default
} from "./chunk-FPYBD2P5.js";

// packages/engine/Source/Core/FrustumOutlineGeometry.js
var PERSPECTIVE = 0;
var ORTHOGRAPHIC = 1;
function FrustumOutlineGeometry(options) {
  Check_default.typeOf.object("options", options);
  Check_default.typeOf.object("options.frustum", options.frustum);
  Check_default.typeOf.object("options.origin", options.origin);
  Check_default.typeOf.object("options.orientation", options.orientation);
  const frustum = options.frustum;
  const orientation = options.orientation;
  const origin = options.origin;
  const drawNearPlane = options._drawNearPlane ?? true;
  let frustumType;
  let frustumPackedLength;
  if (frustum instanceof PerspectiveFrustum_default) {
    frustumType = PERSPECTIVE;
    frustumPackedLength = PerspectiveFrustum_default.packedLength;
  } else if (frustum instanceof OrthographicFrustum_default) {
    frustumType = ORTHOGRAPHIC;
    frustumPackedLength = OrthographicFrustum_default.packedLength;
  }
  this._frustumType = frustumType;
  this._frustum = frustum.clone();
  this._origin = Cartesian3_default.clone(origin);
  this._orientation = Quaternion_default.clone(orientation);
  this._drawNearPlane = drawNearPlane;
  this._workerName = "createFrustumOutlineGeometry";
  this.packedLength = 2 + frustumPackedLength + Cartesian3_default.packedLength + Quaternion_default.packedLength;
}
FrustumOutlineGeometry.pack = function(value, array, startingIndex) {
  Check_default.typeOf.object("value", value);
  Check_default.defined("array", array);
  startingIndex = startingIndex ?? 0;
  const frustumType = value._frustumType;
  const frustum = value._frustum;
  array[startingIndex++] = frustumType;
  if (frustumType === PERSPECTIVE) {
    PerspectiveFrustum_default.pack(frustum, array, startingIndex);
    startingIndex += PerspectiveFrustum_default.packedLength;
  } else {
    OrthographicFrustum_default.pack(frustum, array, startingIndex);
    startingIndex += OrthographicFrustum_default.packedLength;
  }
  Cartesian3_default.pack(value._origin, array, startingIndex);
  startingIndex += Cartesian3_default.packedLength;
  Quaternion_default.pack(value._orientation, array, startingIndex);
  startingIndex += Quaternion_default.packedLength;
  array[startingIndex] = value._drawNearPlane ? 1 : 0;
  return array;
};
var scratchPackPerspective = new PerspectiveFrustum_default();
var scratchPackOrthographic = new OrthographicFrustum_default();
var scratchPackQuaternion = new Quaternion_default();
var scratchPackorigin = new Cartesian3_default();
FrustumOutlineGeometry.unpack = function(array, startingIndex, result) {
  Check_default.defined("array", array);
  startingIndex = startingIndex ?? 0;
  const frustumType = array[startingIndex++];
  let frustum;
  if (frustumType === PERSPECTIVE) {
    frustum = PerspectiveFrustum_default.unpack(
      array,
      startingIndex,
      scratchPackPerspective
    );
    startingIndex += PerspectiveFrustum_default.packedLength;
  } else {
    frustum = OrthographicFrustum_default.unpack(
      array,
      startingIndex,
      scratchPackOrthographic
    );
    startingIndex += OrthographicFrustum_default.packedLength;
  }
  const origin = Cartesian3_default.unpack(array, startingIndex, scratchPackorigin);
  startingIndex += Cartesian3_default.packedLength;
  const orientation = Quaternion_default.unpack(
    array,
    startingIndex,
    scratchPackQuaternion
  );
  startingIndex += Quaternion_default.packedLength;
  const drawNearPlane = array[startingIndex] === 1;
  if (!defined_default(result)) {
    return new FrustumOutlineGeometry({
      frustum,
      origin,
      orientation,
      _drawNearPlane: drawNearPlane
    });
  }
  const frustumResult = frustumType === result._frustumType ? result._frustum : void 0;
  result._frustum = frustum.clone(frustumResult);
  result._frustumType = frustumType;
  result._origin = Cartesian3_default.clone(origin, result._origin);
  result._orientation = Quaternion_default.clone(orientation, result._orientation);
  result._drawNearPlane = drawNearPlane;
  return result;
};
FrustumOutlineGeometry.createGeometry = function(frustumGeometry) {
  const frustumType = frustumGeometry._frustumType;
  const frustum = frustumGeometry._frustum;
  const origin = frustumGeometry._origin;
  const orientation = frustumGeometry._orientation;
  const drawNearPlane = frustumGeometry._drawNearPlane;
  const positions = new Float64Array(3 * 4 * 2);
  FrustumGeometry_default._computeNearFarPlanes(
    origin,
    orientation,
    frustumType,
    frustum,
    positions
  );
  const attributes = new GeometryAttributes_default({
    position: new GeometryAttribute_default({
      componentDatatype: ComponentDatatype_default.DOUBLE,
      componentsPerAttribute: 3,
      values: positions
    })
  });
  let offset;
  let index;
  const numberOfPlanes = drawNearPlane ? 2 : 1;
  const indices = new Uint16Array(8 * (numberOfPlanes + 1));
  let i = drawNearPlane ? 0 : 1;
  for (; i < 2; ++i) {
    offset = drawNearPlane ? i * 8 : 0;
    index = i * 4;
    indices[offset] = index;
    indices[offset + 1] = index + 1;
    indices[offset + 2] = index + 1;
    indices[offset + 3] = index + 2;
    indices[offset + 4] = index + 2;
    indices[offset + 5] = index + 3;
    indices[offset + 6] = index + 3;
    indices[offset + 7] = index;
  }
  for (i = 0; i < 2; ++i) {
    offset = (numberOfPlanes + i) * 8;
    index = i * 4;
    indices[offset] = index;
    indices[offset + 1] = index + 4;
    indices[offset + 2] = index + 1;
    indices[offset + 3] = index + 5;
    indices[offset + 4] = index + 2;
    indices[offset + 5] = index + 6;
    indices[offset + 6] = index + 3;
    indices[offset + 7] = index + 7;
  }
  return new Geometry_default({
    attributes,
    indices,
    primitiveType: PrimitiveType_default.LINES,
    boundingSphere: BoundingSphere_default.fromVertices(positions)
  });
};
var FrustumOutlineGeometry_default = FrustumOutlineGeometry;

// packages/engine/Source/Workers/createFrustumOutlineGeometry.js
function createFrustumOutlineGeometry(frustumGeometry, offset) {
  if (defined_default(offset)) {
    frustumGeometry = FrustumOutlineGeometry_default.unpack(frustumGeometry, offset);
  }
  return FrustumOutlineGeometry_default.createGeometry(frustumGeometry);
}
var createFrustumOutlineGeometry_default = createFrustumOutlineGeometry;
export {
  createFrustumOutlineGeometry_default as default
};
