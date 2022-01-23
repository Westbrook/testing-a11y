import { expect, nextFrame } from '@open-wc/testing';
import { a11ySnapshot, findAccessibilityNode } from '@web/test-runner-commands';

export type DescribedNode = {
    name: string;
    description: string;
};

export const browserName = (): string => {
    const isChrome = /Chrome/.test(window.navigator.userAgent);
    const isWebKit = /AppleWebKit/.test(window.navigator.userAgent);
    if (isChrome) {
        return 'Chromium';
    }
    if (isWebKit) {
        return 'WebKit';
    }
    return 'Nightly';
}

export const findDescribedNode = async (
    name: string,
    description: string
): Promise<void> => {
    await nextFrame();

    const isWebKit =
        /AppleWebKit/.test(window.navigator.userAgent) &&
        !/Chrome/.test(window.navigator.userAgent);

    const snapshot = (await a11ySnapshot({})) as unknown as DescribedNode & {
        children: DescribedNode[];
    };

    // WebKit doesn't currently associate the `aria-describedby` element to the attribute
    // host in the accessibility tree. Give it an escape hatch for now.
    const describedNode = findAccessibilityNode(
        snapshot,
        (node) =>
            node.name === name && (node.description === description || isWebKit)
    );

    expect(describedNode, `node not in: ${JSON.stringify(snapshot, null, '  ')}`).to.not.be.null;

    if (isWebKit) {
        // Retest WebKit without the escape hatch, expecting it to fail.
        // This way we get notified when the results are as expected, again.
        const iOSNode = findAccessibilityNode(
            snapshot,
            (node) => node.name === name && node.description === description
        );
        expect(iOSNode).to.be.null;
    }
};