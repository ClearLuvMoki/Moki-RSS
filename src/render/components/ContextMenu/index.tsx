import React, {memo} from 'react';
import deepEqual from "deep-equal";
import * as RadixContextMenu from '@radix-ui/react-context-menu';


interface Props {
    trigger: React.ReactNode;
}

const ContextMenu = memo(({trigger}: Props) => {
    return (
        <RadixContextMenu.Root>
            <RadixContextMenu.Trigger >
                    {trigger}
            </RadixContextMenu.Trigger>
            <RadixContextMenu.Portal>
                <RadixContextMenu.Content
                    className="w-[200px] bg-white shadow-2xl rounded-lg p-5 overflow-hidden"
                >
                    <RadixContextMenu.Item className="relative">
                        Back <div className="RightSlot">⌘+[</div>
                    </RadixContextMenu.Item>
                </RadixContextMenu.Content>
            </RadixContextMenu.Portal>
        </RadixContextMenu.Root>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default ContextMenu;

