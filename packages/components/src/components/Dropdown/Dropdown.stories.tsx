import React from 'react';
import styled from 'styled-components';
import { Meta, StoryObj } from '@storybook/react';
import { Dropdown as DropdownComponent, DropdownProps } from './Dropdown';

const Center = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 100px 0;
`;

export default {
    title: 'Misc/Dropdown',
    component: DropdownComponent,
} as Meta;

export const Dropdown: StoryObj<DropdownProps> = {
    render: args => (
        <Center>
            <DropdownComponent {...args} />
        </Center>
    ),
    args: {
        addon: {
            onClick: () => {
                console.log('navigate somewhere');
            },
            label: 'some link',
            icon: 'ARROW_RIGHT_LONG',
        },
        items: [
            {
                key: '1',
                label: 'Group 1',
                options: [
                    {
                        key: '1',
                        label: 'item 1',
                        onClick: () => {
                            console.log('item 1 clicked');
                        },
                    },
                    {
                        key: '2',
                        label: 'item 2',
                        onClick: () => {
                            console.log('item 2 clicked');
                        },
                    },
                ],
            },
            {
                key: '2',
                label: 'Group 2 - with rounded items',
                options: [
                    {
                        key: '1',
                        label: 'item 3 with very long name',
                        onClick: () => {
                            console.log('item 1 clicked');
                        },
                    },
                    {
                        key: '2',
                        label: 'disabled item with icon',
                        onClick: () => {
                            console.log('item 2 clicked - disabled');
                        },
                        icon: 'LIGHTBULB',
                        isDisabled: true,
                    },
                    {
                        key: '3',
                        label: 'disabled item with iconRight',
                        onClick: () => {
                            console.log('item 3 clicked - disabled');
                        },
                        iconRight: 'ARROW_RIGHT',
                        isDisabled: true,
                    },
                    {
                        key: '4',
                        label: 'basic item',
                        onClick: () => {
                            console.log('item 4 clicked');
                        },
                    },
                    {
                        key: '5',
                        label: 'item with iconRight and separator',
                        onClick: () => {
                            console.log('item 5 clicked');
                        },
                        iconRight: 'ARROW_RIGHT',
                        separatorBefore: true,
                    },
                ],
            },
        ],
    },
    argTypes: {
        addon: { control: { disable: true } },
        items: { control: { disable: true } },
        content: { control: { disable: true } },
        className: { control: { disable: true } },
        coords: { control: { disable: true } },
    },
};
