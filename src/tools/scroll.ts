/**
 * Copyright (c) Microsoft Corporation.
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
 */

import { z } from 'zod';
import { defineTool } from './tool.js';

const scrollSchema = z.object({
  deltaX: z.number().optional().describe('Horizontal scroll amount'),
  deltaY: z.number().optional().describe('Vertical scroll amount'),
}).refine(data => data.deltaX !== undefined || data.deltaY !== undefined, {
  message: 'Either deltaX or deltaY must be specified',
});

const scroll = defineTool({
  capability: 'core',
  schema: {
    name: 'browser_scroll',
    title: 'Scroll page',
    description: 'Scroll the page by the specified amounts',
    inputSchema: scrollSchema,
    type: 'readOnly',
  },

  handle: async (context, params) => {
    const tab = context.currentTabOrDie();
    const x = params.deltaX ?? 0;
    const y = params.deltaY ?? 0;

    const code = [
      `// Scroll the page by (${x}, ${y})`,
      `await page.mouse.wheel(${x}, ${y});`,
    ];

    const action = async () => {
      await tab.page.mouse.wheel(x, y);
    };

    return {
      code,
      action,
      captureSnapshot: false,
      waitForNetwork: false,
    };
  },
});

export default [
  scroll,
];
