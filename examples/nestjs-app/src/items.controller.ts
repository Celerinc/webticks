/**
 * Items Controller - Sample REST API
 * Demonstrates CRUD operations with WebTicks tracking
 */

import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';

interface Item {
    id: number;
    name: string;
    description: string;
}

@Controller('items')
export class ItemsController {
    private items: Item[] = [
        { id: 1, name: 'Sample Item 1', description: 'This is a sample item' },
        { id: 2, name: 'Sample Item 2', description: 'Another sample item' }
    ];
    private nextId = 3;

    @Get()
    findAll(): Item[] {
        return this.items;
    }

    @Get(':id')
    findOne(@Param('id') id: string): Item {
        const item = this.items.find(i => i.id === parseInt(id));
        if (!item) {
            throw new Error('Item not found');
        }
        return item;
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createItemDto: Omit<Item, 'id'>): Item {
        const newItem: Item = {
            id: this.nextId++,
            ...createItemDto
        };
        this.items.push(newItem);
        return newItem;
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateItemDto: Partial<Item>): Item {
        const itemIndex = this.items.findIndex(i => i.id === parseInt(id));
        if (itemIndex === -1) {
            throw new Error('Item not found');
        }

        this.items[itemIndex] = {
            ...this.items[itemIndex],
            ...updateItemDto
        };

        return this.items[itemIndex];
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string): void {
        const itemIndex = this.items.findIndex(i => i.id === parseInt(id));
        if (itemIndex === -1) {
            throw new Error('Item not found');
        }
        this.items.splice(itemIndex, 1);
    }
}
