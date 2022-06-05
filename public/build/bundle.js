// ==UserScript==
// @name        Figma i18n
// @namespace   https://github.com/NICEXAI
// @version     1.0.6
// @description Powerful, intelligent and easy to use Figma internationalisation scripts.
// @encoding    utf-8
// @author      afeyer
// @homepage    https://github.com/NICEXAI/figma-i18n
// @supportURL  https://github.com/NICEXAI/figma-i18n/issues
// @updateURL   https://github.com/NICEXAI/figma-i18n/blob/main/dist/figma-i18n.normal.js
// @downloadURL https://github.com/NICEXAI/figma-i18n/blob/main/dist/figma-i18n.normal.js
// @match       *://www.figma.com/*
// @run-at      document-end
// @icon        https://static.figma.com/app/icon/1/favicon.png
// @license     Apache; https://github.com/NICEXAI/figma-i18n/blob/main/LICENSE
// @grant       GM_setValue
// ==/UserScript==

(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const matchRuleDict = {
        "fullscreenMenu.BackToFiles": "a[data-onboarding-key='back-to-files']>span[class^='multilevel_dropdown--name']",
        "fullscreenMenu.QuickActions": "div[data-testid='dropdown-option-Quick actions…']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.File": "div[data-testid='dropdown-option-File']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.File.NewDesignFile": "div[data-testid='dropdown-option-New design file']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.File.NewFigJamFile": "div[data-testid='dropdown-option-New FigJam file']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.File.NewFromSketchFile": "div[data-testid='dropdown-option-New from Sketch file…']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.File.PlaceImage": "div[data-testid='dropdown-option-Place image...']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.File.ImportFromCSV": "div[data-testid='dropdown-option-Import from CSV…']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.File.SaveLocalCopy": "div[data-testid='dropdown-option-Save local copy…']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.File.SaveToVersionHistory": "div[data-testid='dropdown-option-Save to version history…']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.File.ShowVersionHistory": "div[data-testid='dropdown-option-Show version history']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.File.Export": "div[data-testid='dropdown-option-Export…']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.File.ExportFramesToPDF": "div[data-testid='dropdown-option-Export frames to PDF…']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.File.ExportAs": "div[data-testid='dropdown-option-Export as…']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.File.ExportSelection": "div[data-testid='dropdown-option-Export selection…']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit": "div[data-testid='dropdown-option-Edit']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.Undo": "div[data-testid='dropdown-option-Undo']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.Redo": "div[data-testid='dropdown-option-Redo']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.CopyAs": "div[data-testid='dropdown-option-Copy as']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.CopyAs.CopyAsText": "div[data-testid='dropdown-option-Copy as text']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.CopyAs.CopyAsCSS": "div[data-testid='dropdown-option-Copy as CSS']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.CopyAs.CopyAsSVG": "div[data-testid='dropdown-option-Copy as SVG']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.CopyAs.CopyAsPNG": "div[data-testid='dropdown-option-Copy as PNG']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.PasteOverSelection": "div[data-testid='dropdown-option-Paste over selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.PasteToReplace": "div[data-testid='dropdown-option-Paste to replace']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.Duplicate": "div[data-testid='dropdown-option-Duplicate']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.Delete": "div[data-testid='dropdown-option-Delete']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.SetDefaultProperties": "div[data-testid='dropdown-option-Set default properties']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.CopyProperties": "div[data-testid='dropdown-option-Copy properties']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.PasteProperties": "div[data-testid='dropdown-option-Paste properties']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.PickColor": "div[data-testid='dropdown-option-Pick color']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.SelectAll": "div[data-testid='dropdown-option-Select all']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.SelectNone": "div[data-testid='dropdown-option-Select none']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.SelectInverse": "div[data-testid='dropdown-option-Select inverse']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.SelectAllWithSameProperties": "div[data-testid='dropdown-option-Select all with same properties']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.SelectAllWithSameFill": "div[data-testid='dropdown-option-Select all with same fill']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.SelectAllWithSameStroke": "div[data-testid='dropdown-option-Select all with same stroke']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.SelectAllWithSameEffect": "div[data-testid='dropdown-option-Select all with same effect']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.SelectAllWithSameTextProperties": "div[data-testid='dropdown-option-Select all with same text properties']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.SelectAllWithSameFont": "div[data-testid='dropdown-option-Select all with same font']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Edit.SelectAllWithSameInstance": "div[data-testid='dropdown-option-Select all with same instance']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View": "div[data-testid='dropdown-option-View']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.PixelGrid": "div[data-testid='dropdown-option-Pixel grid']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.LayoutGrids": "div[data-testid='dropdown-option-Layout grids']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.Rulers": "div[data-testid='dropdown-option-Rulers']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.ShowSlices": "div[data-testid='dropdown-option-Show slices']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.Comments": "div[data-testid='dropdown-option-Comments']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.Outlines": "div[data-testid='dropdown-option-Outlines']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.PixelPreview": "div[data-testid='dropdown-option-Pixel preview']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.MaskOutlines": "div[data-testid='dropdown-option-Mask outlines']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.FrameOutlines": "div[data-testid='dropdown-option-Frame outlines']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.ShowDotGrid": "div[data-testid='dropdown-option-Show dot grid']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.ResourceUse": "div[data-testid='dropdown-option-Resource use']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.ShowOrHideUI": "div[data-testid='dropdown-option-Show/Hide UI']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.MultiplayerCursors": "div[data-testid='dropdown-option-Multiplayer cursors']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.Panels": "div[data-testid='dropdown-option-Panels']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.Panels.OpenLayersPanel": "div[data-testid='dropdown-option-Open layers panel']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.Panels.OpenDesignPanel": "div[data-testid='dropdown-option-Open design panel']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.Panels.OpenPrototypePanel": "div[data-testid='dropdown-option-Open prototype panel']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.Panels.OpenInspectPanel": "div[data-testid='dropdown-option-Open inspect panel']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.Panels.ShowLeftSidebar": "div[data-testid='dropdown-option-Show left sidebar']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.ZoomIn": "div[data-testid='dropdown-option-Zoom in']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.ZoomOut": "div[data-testid='dropdown-option-Zoom out']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.ZoomTo100%": "div[data-testid='dropdown-option-Zoom to 100%']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.ZoomToFit": "div[data-testid='dropdown-option-Zoom to fit']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.ZoomToSelection": "div[data-testid='dropdown-option-Zoom to selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.PreviousPage": "div[data-testid='dropdown-option-Previous page']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.NextPage": "div[data-testid='dropdown-option-Next page']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.ZoomToPreviousFrame": "div[data-testid='dropdown-option-Zoom to previous frame']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.ZoomToNextFrame": "div[data-testid='dropdown-option-Zoom to next frame']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.FindPreviousFrame": "div[data-testid='dropdown-option-Find previous frame']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.View.FindNextFrame": "div[data-testid='dropdown-option-Find next frame']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object": "div[data-testid='dropdown-option-Object']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.GroupSelection": "div[data-testid='dropdown-option-Group selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.CreateSection": "div[data-testid='dropdown-option-Create section']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.FrameSelection": "div[data-testid='dropdown-option-Frame selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.UngroupSelection": "div[data-testid='dropdown-option-Ungroup selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.UseAsMask": "div[data-testid='dropdown-option-Use as mask']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.RestoreDefaultThumbnail": "div[data-testid='dropdown-option-Restore default thumbnail']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.SetAsThumbnail": "div[data-testid='dropdown-option-Set as thumbnail']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.AddAutoLayout": "div[data-testid='dropdown-option-Add auto layout']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.CreateComponent": "div[data-testid='dropdown-option-Create component']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.ResetAllOverrides": "div[data-testid='dropdown-option-Reset all overrides']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.DetachInstance": "div[data-testid='dropdown-option-Detach instance']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.MainComponent": "div[data-testid='dropdown-option-Main component']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.MainComponent.GoToMainComponent": "div[data-testid='dropdown-option-Go to main component']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.MainComponent.PushOverridesToMainComponent": "div[data-testid='dropdown-option-Push overrides to main component']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.MainComponent.RestoreMainComponent": "div[data-testid='dropdown-option-Restore main component']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.BringToFront": "div[data-testid='dropdown-option-Bring to front']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.BringForward": "div[data-testid='dropdown-option-Bring forward']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.SendBackward": "div[data-testid='dropdown-option-Send backward']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.SendToBack": "div[data-testid='dropdown-option-Send to back']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.flipHorizontal": "div[data-testid='dropdown-option-Flip horizontal']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.flipVertical": "div[data-testid='dropdown-option-Flip vertical']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.Rotate180": "div[data-testid='dropdown-option-Rotate 180˚']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.Rotate90Left": "div[data-testid='dropdown-option-Rotate 90˚ left']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.Rotate90Right": "div[data-testid='dropdown-option-Rotate 90˚ right']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.FlattenSelection": "div[data-testid='dropdown-option-Flatten selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.OutlineStroke": "div[data-testid='dropdown-option-Outline stroke']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.BooleanGroups": "div[data-testid='dropdown-option-Boolean groups']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.BooleanGroups.UnionSelection": "div[data-testid='dropdown-option-Union selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.BooleanGroups.SubtractSelection": "div[data-testid='dropdown-option-Subtract selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.BooleanGroups.IntersectSelection": "div[data-testid='dropdown-option-Intersect selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.BooleanGroups.ExcludeSelection": "div[data-testid='dropdown-option-Exclude selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.RasterizeSelection": "div[data-testid='dropdown-option-Rasterize selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.ShowOrHideSelection": "div[data-testid='dropdown-option-Show/Hide selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.LockOrUnlockSelection": "div[data-testid='dropdown-option-Lock/Unlock selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.HideOtherLayers": "div[data-testid='dropdown-option-Hide other layers']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.CollapseLayers": "div[data-testid='dropdown-option-Collapse layers']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.RemoveFill": "div[data-testid='dropdown-option-Remove fill']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.RemoveStroke": "div[data-testid='dropdown-option-Remove stroke']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Object.SwapFillAndStroke": "div[data-testid='dropdown-option-Swap fill and stroke']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Vector": "div[data-testid='dropdown-option-Vector']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Vector.JoinSelection": "div[data-testid='dropdown-option-Join selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Vector.SmoothJoinSelection": "div[data-testid='dropdown-option-Smooth join selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Vector.DeleteAndHealSelection": "div[data-testid='dropdown-option-Delete and heal selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text": "div[data-testid='dropdown-option-Text']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Bold": "div[data-testid='dropdown-option-Bold']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Italic": "div[data-testid='dropdown-option-Italic']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Underline": "div[data-testid='dropdown-option-Underline']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Strikethrough": "div[data-testid='dropdown-option-Strikethrough']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.CreateLink": "div[data-testid='dropdown-option-Create link']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.BulletedList": "div[data-testid='dropdown-option-Bulleted list']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.NumberedList": "div[data-testid='dropdown-option-Numbered list']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Alignment": "div[data-testid='dropdown-option-Alignment']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Alignment.TextAlignLeft": "div[data-testid='dropdown-option-Text align left']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Alignment.TextAlignCenter": "div[data-testid='dropdown-option-Text align center']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Alignment.TextAlignRight": "div[data-testid='dropdown-option-Text align right']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Alignment.TextAlignJustified": "div[data-testid='dropdown-option-Text align justified']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Alignment.TextAlignTop": "div[data-testid='dropdown-option-Text align top']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Alignment.TextAlignMiddle": "div[data-testid='dropdown-option-Text align middle']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Alignment.TextAlignBottom": "div[data-testid='dropdown-option-Text align bottom']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Adjust": "div[data-testid='dropdown-option-Adjust']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Adjust.IncreaseIndentation": "div[data-testid='dropdown-option-Increase indentation']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Adjust.DecreaseIndentation": "div[data-testid='dropdown-option-Decrease indentation']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Adjust.IncreaseFontSize": "div[data-testid='dropdown-option-Increase font size']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Adjust.DecreaseFontSize": "div[data-testid='dropdown-option-Decrease font size']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Adjust.IncreaseFontWeight": "div[data-testid='dropdown-option-Increase font weight']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Adjust.DecreaseFontWeight": "div[data-testid='dropdown-option-Decrease font weight']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Adjust.IncreaseLineHeight": "div[data-testid='dropdown-option-Increase line height']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Adjust.DecreaseLineHeight": "div[data-testid='dropdown-option-Decrease line height']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Adjust.IncreaseLetterSpacing": "div[data-testid='dropdown-option-Increase letter spacing']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Adjust.DecreaseLetterSpacing": "div[data-testid='dropdown-option-Decrease letter spacing']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Case": "div[data-testid='dropdown-option-Case']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Case.OriginalCase": "div[data-testid='dropdown-option-Original case']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Case.Uppercase": "div[data-testid='dropdown-option-Uppercase']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Text.Case.Lowercase": "div[data-testid='dropdown-option-Lowercase']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange": "div[data-testid='dropdown-option-Arrange']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.RoundToPixel": "div[data-testid='dropdown-option-Round to pixel']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.AlignLeft": "div[data-testid='dropdown-option-Align left']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.AlignHorizontalCenters": "div[data-testid='dropdown-option-Align horizontal centers']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.AlignRight": "div[data-testid='dropdown-option-Align right']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.AlignTop": "div[data-testid='dropdown-option-Align top']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.AlignVerticalCenters": "div[data-testid='dropdown-option-Align vertical centers']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.AlignBottom": "div[data-testid='dropdown-option-Align bottom']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.TidyUp": "div[data-testid='dropdown-option-Tidy up']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.PackHorizontal": "div[data-testid='dropdown-option-Pack horizontal']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.PackVertical": "div[data-testid='dropdown-option-Pack vertical']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.DistributeHorizontalSpacing": "div[data-testid='dropdown-option-Distribute horizontal spacing']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.DistributeVerticalSpacing": "div[data-testid='dropdown-option-Distribute vertical spacing']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.DistributeLeft": "div[data-testid='dropdown-option-Distribute left']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.DistributeHorizontalCenters": "div[data-testid='dropdown-option-Distribute horizontal centers']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.DistributeRight": "div[data-testid='dropdown-option-Distribute right']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.DistributeTop": "div[data-testid='dropdown-option-Distribute top']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.DistributeVerticalCenters": "div[data-testid='dropdown-option-Distribute vertical centers']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Arrange.DistributeBottom": "div[data-testid='dropdown-option-Distribute bottom']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Plugins": "div[data-testid='dropdown-option-Plugins']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Plugins.RunLastPlugin": "div[data-testid='dropdown-option-Run last plugin']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Plugins.ManagePlugins": "div[data-testid='dropdown-option-Manage plugins…']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Plugins.BrowsePluginsInCommunity": "div[data-testid='dropdown-option-Browse plugins in Community']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Plugins.BrowsePlugins": "div[data-testid='dropdown-option-Browse plugins']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Widgets": "div[data-testid='dropdown-option-Widgets']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Widgets.BrowseWidgets": "div[data-testid='dropdown-option-Browse widgets']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Widgets.SelectAllWidgets": "div[data-testid='dropdown-option-Select all widgets']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Integrations": "div[data-testid='dropdown-option-Integrations']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Integrations.Dribbble": "div[data-testid='dropdown-option-Dribbble']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences": "div[data-testid='dropdown-option-Preferences']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.SnapToGeometry": "div[data-testid='dropdown-option-Snap to geometry']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.SnapToObjects": "div[data-testid='dropdown-option-Snap to objects']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.SnapToDotGrid": "div[data-testid='dropdown-option-Snap to dot grid']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.SnapToPixelGrid": "div[data-testid='dropdown-option-Snap to pixel grid']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.KeepToolSelectedAfterUse": "div[data-testid='dropdown-option-Keep tool selected after use']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.HighlightLayersOnHover": "div[data-testid='dropdown-option-Highlight layers on hover']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.RenameDuplicatedLayers": "div[data-testid='dropdown-option-Rename duplicated layers']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.ShowDimensionsOnObjects": "div[data-testid='dropdown-option-Show dimensions on objects']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.HideCanvasUIDuringChanges": "div[data-testid='dropdown-option-Hide canvas UI during changes']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.KeyboardZoomsIntoSelection": "div[data-testid='dropdown-option-Keyboard zooms into selection']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.SubstituteSmartQuotes": "div[data-testid='dropdown-option-Substitute smart quotes']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.ShowGoogleFonts": "div[data-testid='dropdown-option-Show Google Fonts']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.FlipObjectsWhileResizing": "div[data-testid='dropdown-option-Flip objects while resizing']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.InvertZoomDirection": "div[data-testid='dropdown-option-Invert zoom direction']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.UseNumberKeysForOpacity": "div[data-testid='dropdown-option-Use number keys for opacity']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.ShakeCursorForHighFive": "div[data-testid='dropdown-option-Shake cursor for high five']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.OpenLinksInDesktopApp": "div[data-testid='dropdown-option-Open links in desktop app']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.NudgeAmount": "div[data-testid='dropdown-option-Nudge amount…']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Preferences.ShowTemplatesForNewFiles": "div[data-testid='dropdown-option-Show templates for new files']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Libraries": "div[data-testid='dropdown-option-Libraries']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.GetDesktopApp": "div[data-testid='dropdown-option-Get desktop app']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.OpenInDesktopApp": "div[data-testid='dropdown-option-Open in desktop app']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.HelpAndAccount": "div[data-testid='dropdown-option-Help and account']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.HelpAndAccount.HelpPage": "div[data-testid='dropdown-option-Help page']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.HelpAndAccount.KeyboardShortcuts": "div[data-testid='dropdown-option-Keyboard shortcuts']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.HelpAndAccount.SupportForum": "div[data-testid='dropdown-option-Support forum']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.HelpAndAccount.VideoTutorials": "div[data-testid='dropdown-option-Video tutorials']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.HelpAndAccount.ReleaseNotes": "div[data-testid='dropdown-option-Release notes']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.HelpAndAccount.OpenFontSettings": "div[data-testid='dropdown-option-Open font settings']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.HelpAndAccount.LegalSummary": "div[data-testid='dropdown-option-Legal summary']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.HelpAndAccount.AccountSettings": "div[data-testid='dropdown-option-Account settings']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.HelpAndAccount.LogOut": "div[data-testid='dropdown-option-Log out']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.PublishStylesAndComponents": "div[data-testid='dropdown-option-Publish styles and components']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Rename": "div[data-testid='dropdown-option-Rename']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.MoveToProject": "div[data-testid='dropdown-option-Move to project…']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Delete": "div[data-testid='dropdown-option-Delete…']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.ZoomTo50": "div[data-testid='dropdown-option-Zoom to 50%']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.ZoomTo200": "div[data-testid='dropdown-option-Zoom to 200%']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Disabled": "div[data-testid='dropdown-option-Disabled']>div[class^='multilevel_dropdown--name']",
        "fullscreenMenu.Tooltip.MainMenu": "div[class*='toolbar_view--toolbar']>div[data-tooltip='main-menu']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.MoveTools": "div[class*='toolbar_view--toolbar'] div[data-tooltip='Move tools']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolDefault": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-default']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolScale": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-scale']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.RegionTools": "div[class*='toolbar_view--toolbar'] div[data-tooltip='Region tools']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolFrame": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-frame']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolSlice": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-slice']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.ShapeTools": "div[class*='toolbar_view--toolbar'] div[data-tooltip='Shape tools']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolRectangle": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-rectangle']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolLine": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-line']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolArrow": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-arrow']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolEllipse": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-ellipse']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolRegularPolygon": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-regular-polygon']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolStar": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-star']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.DrawingTools": "div[class*='toolbar_view--toolbar'] div[data-tooltip='Drawing tools']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolPen": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-pen']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolPencil": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-pencil']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolText": "div[class*='toolbar_view--toolbar'] span[data-tooltip='set-tool-type']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolHand": "div[class*='toolbar_view--toolbar'] span[data-tooltip='set-tool-hand']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SetToolComments": "div[class*='toolbar_view--toolbar'] span[data-tooltip='set-tool-comments']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.Present": "div[class*='toolbar_view--toolbar'] div[data-tooltip='Present']->attr:data-tooltip",
        "fullscreenMenu.Tooltip.CreateComponent": "div[class*='toolbar_view--toolbar'] span[data-tooltip='create-symbol']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.UseAsMask": "div[class*='toolbar_view--toolbar'] span[data-tooltip='mask-selection']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.BooleanGroups": "div[class*='toolbar_view--toolbar'] div[data-tooltip='Boolean groups']->attr:data-tooltip",
        "fullscreenMenu.Tooltip.UnionSelection": "div[class*='toolbar_view--toolbar'] div[data-tooltip='live-boolean-union']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.SubtractSelection": "div[class*='toolbar_view--toolbar'] div[data-tooltip='live-boolean-subtract']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.IntersectSelection": "div[class*='toolbar_view--toolbar'] div[data-tooltip='live-boolean-intersect']->attr:data-tooltip,data-tooltip-type=text",
        "fullscreenMenu.Tooltip.ExcludeSelection": "div[class*='toolbar_view--toolbar'] div[data-tooltip='live-boolean-xor']->attr:data-tooltip,data-tooltip-type=text",
        "toolbarView.fileName.folderName.Drafts": "XPATH://div[contains(@class, 'filename_view--folder')]//div[text()='Drafts']",
        "toolbarView.moveFlyout.flyout.toolDefault": "a[data-testid='toolbarView.moveFlyout.flyout.toolDefault']>div[class^='action_option--text']",
        "toolbarView.moveFlyout.flyout.toolScale": "a[data-testid='toolbarView.moveFlyout.flyout.toolScale']>div[class^='action_option--text']",
        "toolbarView.regionFlyout.flyout.toolFrame": "a[data-testid='toolbarView.regionFlyout.flyout.toolFrame']>div[class^='action_option--text']",
        "toolbarView.regionFlyout.flyout.toolSlice": "a[data-testid='toolbarView.regionFlyout.flyout.toolSlice']>div[class^='action_option--text']",
        "toolbarView.shapeFlyout.flyout.toolShapeRectangle": "a[data-testid='toolbarView.shapeFlyout.flyout.toolShapeRectangle']>div[class^='action_option--text']",
        "toolbarView.shapeFlyout.flyout.toolShapeLine": "a[data-testid='toolbarView.shapeFlyout.flyout.toolShapeLine']>div[class^='action_option--text']",
        "toolbarView.shapeFlyout.flyout.toolShapeArrow": "a[data-testid='toolbarView.shapeFlyout.flyout.toolShapeArrow']>div[class^='action_option--text']",
        "toolbarView.shapeFlyout.flyout.toolShapeEllipse": "a[data-testid='toolbarView.shapeFlyout.flyout.toolShapeEllipse']>div[class^='action_option--text']",
        "toolbarView.shapeFlyout.flyout.toolShapePolygon": "a[data-testid='toolbarView.shapeFlyout.flyout.toolShapePolygon']>div[class^='action_option--text']",
        "toolbarView.shapeFlyout.flyout.toolShapeStar": "a[data-testid='toolbarView.shapeFlyout.flyout.toolShapeStar']>div[class^='action_option--text']",
        "toolbarView.shapeFlyout.flyout.toolPlaceImage": "a[data-testid='toolbarView.shapeFlyout.flyout.toolPlaceImage']>div[class^='action_option--text']",
        "toolbarView.penFlyout.flyout.toolPen": "a[data-testid='toolbarView.penFlyout.flyout.toolPen']>div[class^='action_option--text']",
        "toolbarView.penFlyout.flyout.toolPencil": "a[data-testid='toolbarView.penFlyout.flyout.toolPencil']>div[class^='action_option--text']",
        "toolbarView.booleanFlyout.flyout.toolBooleanUnion": "a[data-testid='toolbarView.booleanFlyout.flyout.toolBooleanUnion']>div[class^='action_option--text']",
        "toolbarView.booleanFlyout.flyout.toolBooleanSubtract": "a[data-testid='toolbarView.booleanFlyout.flyout.toolBooleanSubtract']>div[class^='action_option--text']",
        "toolbarView.booleanFlyout.flyout.toolBooleanIntersect": "a[data-testid='toolbarView.booleanFlyout.flyout.toolBooleanIntersect']>div[class^='action_option--text']",
        "toolbarView.booleanFlyout.flyout.toolBooleatoolBooleanXornUnion": "a[data-testid='toolbarView.booleanFlyout.flyout.toolBooleanXor']>div[class^='action_option--text']",
        "toolbarView.booleanFlyout.flyout.toolFlatten": "a[data-testid='toolbarView.booleanFlyout.flyout.toolFlatten']>div[class^='action_option--text']",
        "toolbarView.Share": "div[data-testid='multiplayer-toolbar-share-button']",
        "toolbarView.CursorChat": "div[data-testid='dropdown-option-Cursor chat']>div[class^='multilevel_dropdown--name']",
        "toolbarView.Stamp": "div[data-testid='dropdown-option-Stamp']>div[class^='multilevel_dropdown--name']",
        "toolbarView.Emote": "div[data-testid='dropdown-option-Emote']>div[class^='multilevel_dropdown--name']",
        "toolbarView.Overflow.Emote": "XPATH://a[@data-testid='overflow.emote']//div[contains(@class,'toolbar_view--overflowInner')]//text()[1]",
        "toolbarView.Overflow.Stamp": "XPATH://a[@data-testid='overflow.stamp']//div[contains(@class,'toolbar_view--overflowInner')]//text()[1]",
        "toolbarView.Overflow.CursorChat": "XPATH://a[@data-testid='overflow.chat']//div[contains(@class,'toolbar_view--overflowInner')]//text()[1]",
        "toolbarView.Overflow.HighFive": "XPATH://a[@data-testid='overflow.highFive']//div[contains(@class,'toolbar_view--overflowInner')]//text()[1]",
        "toolbarView.Overflow.Timer": "XPATH://a[@data-testid='overflow.timer']//div[contains(@class,'toolbar_view--overflowInner')]//text()[1]",
        "toolbarView.Tooltip.Collaborate": "div[class*='toolbar_view--toolbar'] div[data-tooltip='whiteboard-overflow-menu']->attr:data-tooltip,data-tooltip-type=text",
        "toolbarView.Tooltip.ZoomOut": "div[class*='toolbar_view--toolbar'] span[data-tooltip='zoom-out']->attr:data-tooltip,data-tooltip-type=text",
        "toolbarView.Tooltip.ZoomIn": "div[class*='toolbar_view--toolbar'] span[data-tooltip='zoom-in']->attr:data-tooltip,data-tooltip-type=text",
        "toolbarView.Tooltip.ZoomOrViewOptions": "div[class*='toolbar_view--toolbar'] div[data-tooltip='Zoom/view options']->attr:data-tooltip",
        "delightfulToolbar.MoveTool": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-default-desc']->attr:data-tooltip,data-tooltip-type=text",
        "delightfulToolbar.HandTool": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-hand']->attr:data-tooltip,data-tooltip-type=text",
        "delightfulToolbar.Marker": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-marker']->attr:data-tooltip,data-tooltip-type=text",
        "delightfulToolbar.Highlighter": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-highlighter']->attr:data-tooltip,data-tooltip-type=text",
        "delightfulToolbar.Eraser": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-eraser']->attr:data-tooltip,data-tooltip-type=text",
        "delightfulToolbar.Thin": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Thin']->attr:data-tooltip",
        "delightfulToolbar.Thick": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Thick']->attr:data-tooltip",
        "delightfulToolbar.Charcoal": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Charcoal']->attr:data-tooltip",
        "delightfulToolbar.Red": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Red']->attr:data-tooltip",
        "delightfulToolbar.Yellow": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Yellow']->attr:data-tooltip",
        "delightfulToolbar.Green": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Green']->attr:data-tooltip",
        "delightfulToolbar.Blue": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Blue']->attr:data-tooltip",
        "delightfulToolbar.Violet": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Violet']->attr:data-tooltip",
        "delightfulToolbar.Brown": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Brown']->attr:data-tooltip",
        "delightfulToolbar.White": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='White']->attr:data-tooltip",
        "delightfulToolbar.Square": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-square']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.Ellipse": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-ellipse']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.RoundedRectangle": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-rounded-rectangle']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.Diamond": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-diamond']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.TriangleUp": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-triangle-up']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.TriangleDown": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-triangle-down']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.ParallelogramRight": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-parallelogram-right']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.ParallelogramLeft": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-parallelogram-left']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.Cylinder": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-eng-database']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.HorizontalCylinder": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-eng-queue']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.File": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-eng-file']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.Folder": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-eng-folder']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.Options.Square": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Square']->attr:data-tooltip",
        "delightfulToolbar.Options.Ellipse": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Ellipse']->attr:data-tooltip",
        "delightfulToolbar.Options.RoundedRectangle": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Rounded rectangle']->attr:data-tooltip",
        "delightfulToolbar.Options.Diamond": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Diamond']->attr:data-tooltip",
        "delightfulToolbar.Options.Triangle": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Triangle']->attr:data-tooltip",
        "delightfulToolbar.Options.DownwardPointingTriangle": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Downward-pointing triangle']->attr:data-tooltip",
        "delightfulToolbar.Options.RightLeaningParallelogram": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Right-leaning parallelogram']->attr:data-tooltip",
        "delightfulToolbar.Options.LeftLeaningParallelogram": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Left-leaning parallelogram']->attr:data-tooltip",
        "delightfulToolbar.Options.Cylinder": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Cylinder']->attr:data-tooltip",
        "delightfulToolbar.Options.HorizontalCylinder": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Horizontal cylinder']->attr:data-tooltip",
        "delightfulToolbar.Options.File": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='File']->attr:data-tooltip",
        "delightfulToolbar.Options.Folder": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Folder']->attr:data-tooltip",
        "delightfulToolbar.Sticky": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-sticky']->attr:data-tooltip,data-tooltip-type=text",
        "delightfulToolbar.Text": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-type']->attr:data-tooltip,data-tooltip-type=text",
        "delightfulToolbar.Connector": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-connector-elbowed']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.Line": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-connector-straight']->attr:data-tooltip,data-tooltip-type=text,no-track",
        "delightfulToolbar.Options.Connector": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Connector']->attr:data-tooltip",
        "delightfulToolbar.Options.StraightLine": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Straight line']->attr:data-tooltip",
        "delightfulToolbar.Stamp": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-stamp']->attr:data-tooltip,data-tooltip-type=text",
        "delightfulToolbar.More": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='browse-all-resources-dlt']->attr:data-tooltip,data-tooltip-type=text",
        "contextMenu.Copy": "div[data-testid='dropdown-option-Copy']>div[class^='multilevel_dropdown--name']",
        "contextMenu.Paste": "div[data-testid='dropdown-option-Paste']>div[class^='multilevel_dropdown--name']",
        "contextMenu.PasteHere": "div[data-testid='dropdown-option-Paste here']>div[class^='multilevel_dropdown--name']",
        "contextMenu.CopyOrPasteAs": "div[data-testid='dropdown-option-Copy/Paste as']>div[class^='multilevel_dropdown--name']",
        "contextMenu.CopyOrPasteAs.CopyLink": "div[data-testid='dropdown-option-Copy  link']>div[class^='multilevel_dropdown--name']",
        "contextMenu.SelectLayer": "div[data-testid='dropdown-option-Select layer']>div[class^='multilevel_dropdown--name']",
        "contextMenu.MoveToPage": "div[data-testid='dropdown-option-Move to page']>div[class^='multilevel_dropdown--name']",
        "contextMenu.Ungroup": "div[data-testid='dropdown-option-Ungroup']>div[class^='multilevel_dropdown--name']",
        "contextMenu.Flatten": "div[data-testid='dropdown-option-Flatten']>div[class^='multilevel_dropdown--name']",
        "contextMenu.ShowOrHide": "div[data-testid='dropdown-option-Show/Hide']>div[class^='multilevel_dropdown--name']",
        "contextMenu.LockOrUnlock": "div[data-testid='dropdown-option-Lock/Unlock']>div[class^='multilevel_dropdown--name']",
        "contextMenu.ShowOrHideComments": "div[data-testid='dropdown-option-Show/Hide comments']>div[class^='multilevel_dropdown--name']",
        "pagesPanel.Sidebar.Tab": "div[class*='pages_panel--tabsHeader']>div[class*='pages_panel--tab']->attr:data-label",
        "pagesPanel.Sidebar.AssetsTab": "div[class*='pages_panel--tabsHeader']>div[class*='pages_panel--assetsTab']>div[class*='pages_panel--tab']->attr:data-label",
        "pagesPanel.Sidebar.Pages": "div[class*='pages_panel--pagesHeaderContainer']>div[class*='pages_panel--pagesHeaderText']",
        "pagesPanel.Sidebar.Pages.CopyLinkToPage": "div[data-testid='dropdown-option-Copy link to page']>div[class^='multilevel_dropdown--name']",
        "pagesPanel.Sidebar.Pages.DeletePage": "div[data-testid='dropdown-option-Delete page']>div[class^='multilevel_dropdown--name']",
        "pagesPanel.Sidebar.Pages.RenamePage": "div[data-testid='dropdown-option-Rename page']>div[class^='multilevel_dropdown--name']",
        "pagesPanel.Sidebar.Pages.DuplicatePage": "div[data-testid='dropdown-option-Duplicate page']>div[class^='multilevel_dropdown--name']",
        "pagesPanel.Sidebar.AddNewPage": "div[class*='pages_panel--pagesHeaderContainer'] span[aria-label='Add new page']->attr:data-tooltip",
        "pagesPanel.Sidebar.Search": "div[class*='component_sidebar--headerContainer'] input[class*='search--searchInput__DEPRECATED']->attr:placeholder",
        "pagesPanel.Sidebar.ShowAsList": "div[class*='component_sidebar--headerContainer'] span[aria-label='Show as list']->attr:data-tooltip",
        "pagesPanel.Sidebar.ShowAsGrid": "div[class*='component_sidebar--headerContainer'] span[aria-label='Show as grid']->attr:data-tooltip",
        "pagesPanel.Sidebar.TeamLibrary": "div[class*='component_sidebar--headerContainer'] span[aria-label='Team library']->attr:data-tooltip",
        "pagesPanel.Sidebar.Components": "XPATH://div[contains(@class, 'component_sidebar--container')]//div[text()='Components']",
        "pagesPanel.Sidebar.Components.FirstInfoText": "XPATH://div[contains(@class, 'component_sidebar--container')]//div[contains(@class, 'empty_states--emptyStateContent')][1]//div[contains(@class, 'empty_states--emptyStateText')]//text()[1]",
        "pagesPanel.Sidebar.Components.FirstInfoLink": "XPATH://div[contains(@class, 'component_sidebar--container')]//div[contains(@class, 'empty_states--emptyStateContent')][1]//div[contains(@class, 'empty_states--emptyStateText')]//a",
        "pagesPanel.Sidebar.Components.SecondInfoText": "XPATH://div[contains(@class, 'component_sidebar--container')]//div[contains(@class, 'empty_states--emptyStateContent')][2]//div[contains(@class, 'empty_states--emptyStateText')]//text()[1]",
        "pagesPanel.Sidebar.Components.SecondInfoLink": "XPATH://div[contains(@class, 'component_sidebar--container')]//div[contains(@class, 'empty_states--emptyStateContent')][2]//div[contains(@class, 'empty_states--emptyStateText')]//a",
        "propertiesPanel.TabsHeader.Design": "XPATH://div[contains(@class, 'properties_panel--tabsHeader')]//div[text()='Design']->attr:data-label",
        "propertiesPanel.TabsHeader.Prototype": "XPATH://div[contains(@class, 'properties_panel--tabsHeader')]//div[text()='Prototype']->attr:data-label",
        "propertiesPanel.TabsHeader.Inspect": "XPATH://div[contains(@class, 'properties_panel--tabsHeader')]//div[text()='Inspect']->attr:data-label",
        "navbar.Community": "XPATH://div[@data-testid='dropdown-option-Community']//div[text()='Community']",
        "navbar.Search": "XPATH://div[contains(@class, 'navbar--navbarContainer')]//input[contains(@class, 'search--searchInput')]->attr:placeholder",
        "navbar.Notifications": "XPATH://div[contains(@class, 'user_notifications_dropdown--header')]//div[text()='Notifications']",
        "navbar.InternalProfile": "div[data-testid='dropdown-option-Internal profile']>div[class^='multilevel_dropdown--name']",
        "navbar.Settings": "div[data-testid='dropdown-option-Settings']>div[class^='multilevel_dropdown--name']",
        "navbar.AddAccount": "div[data-testid='dropdown-option-Add account']>div[class^='multilevel_dropdown--name']",
        "sidebar.Recents": "XPATH://div[contains(@class, 'sidebar--navContent')]//span[text()='Recents']",
        "sidebar.Drafts": "XPATH://div[contains(@class, 'sidebar--navContent')]//span[text()='Drafts']",
        "sidebar.ExploreCommunity": "XPATH://div[contains(@class, 'sidebar--navContent')]//a[contains(@class, 'community_hub_link')]//span[text()='Explore community']",
        "sidebar.TeamProject": "XPATH://div[contains(@class, 'sidebar--navContent')]//div[contains(@class, 'nav_section--orderedFolders')]//span[text()='Team project']",
        "sidebar.CreateNewTeam": "XPATH://div[contains(@class, 'sidebar--navContent')]//div[contains(@class, 'new_team_link--createNewTeamLink')]//div[text()='Create new team']",
        "fileBrowserView.RecentlyViewed": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'desktop_tool_bar--pageViewToolBarContainer')]//span[text()='Recently viewed']",
        "fileBrowserView.Drafts": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'desktop_tool_bar--pageViewToolBarContainer')]//span[text()='Drafts']",
        "fileBrowserView.Deleted": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'desktop_tool_bar--pageViewToolBarContainer')]//span[text()='Deleted']",
        "fileBrowserView.NewDesignFile": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'new_file_creation_topbar--newFileTilesContainer')]//div[@data-testid='new-design-file-button']//text()[1]",
        "fileBrowserView.NewDesignFile.Desc": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'new_file_creation_topbar--newFileTilesContainer')]//div[@data-testid='new-design-file-button']//div",
        "fileBrowserView.NewFigJamFile": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'new_file_creation_topbar--newFileTilesContainer')]//div[@data-testid='new-whiteboard-file-button']//text()[1]",
        "fileBrowserView.NewFigJamFile.Desc": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'new_file_creation_topbar--newFileTilesContainer')]//div[@data-testid='new-whiteboard-file-button']//div",
        "fileBrowserView.ImportFile": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'new_file_creation_topbar--importFileTile')]//div[contains(@class, 'new_file_creation_topbar--tileText')]//text()[1]",
        "fileBrowserView.ImportFile.Desc": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'new_file_creation_topbar--importFileTile')]//div[contains(@class, 'new_file_creation_topbar--tileText')]//div",
        "fileBrowserView.Filter": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'tile_sort_filter--dropdownCollectionContainer')]//div[text()='Filter:']",
        // "fileBrowserView.AllFiles": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'tile_sort_filter--dropdownCollectionContainer')]//span[text()='All files']->attr:text-content,no-track",
        "fileBrowserView.Filter.Select.AllFiles": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='All files']",
        "fileBrowserView.Filter.Select.DesignFiles": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Design files']",
        "fileBrowserView.Filter.Select.FigJamFiles": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='FigJam Files']",
        "fileBrowserView.Filter.Select.Prototypes": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Prototypes']",
        "fileBrowserView.Sort": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[text()='Sort:']",
        "fileBrowserView.Sort.Select.SortBy": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Sort by']",
        "fileBrowserView.Sort.Select.Alphabetical": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Alphabetical']",
        "fileBrowserView.Sort.Select.DateCreated": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Date created']",
        "fileBrowserView.Sort.Select.LastViewed": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Last viewed']",
        "fileBrowserView.Sort.Select.LastModified": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Last modified']",
        "fileBrowserView.Sort.Select.Order": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Order']",
        "fileBrowserView.Sort.Select.OldestFirst": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Oldest first']",
        "fileBrowserView.Sort.Select.NewestFirst": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Newest first']",
        "fileBrowserView.ShowAsGrid": "div[class*='file_browser_page_view--contentContainer'] span[data-tooltip='Show as grid']->attr:data-tooltip",
        "fileBrowserView.ShowAsList": "div[class*='file_browser_page_view--contentContainer'] span[data-tooltip='Show as list']->attr:data-tooltip",
        "fileBrowserView.ContextMenu.ShowInProject": "XPATH://a[text()='Show in project']",
        "fileBrowserView.ContextMenu.Open": "XPATH://a[text()='Open']",
        "fileBrowserView.ContextMenu.OpenInNewTab": "XPATH://a[text()='Open in new tab']",
        "fileBrowserView.ContextMenu.CopyLink": "XPATH://a[text()='Copy link']",
        "fileBrowserView.ContextMenu.AddToYourFavorites": "XPATH://a[text()='Add to your favorites']",
        "fileBrowserView.ContextMenu.Share": "XPATH://a[text()='Share']",
        "fileBrowserView.ContextMenu.Duplicate": "XPATH://a[text()='Duplicate']",
        "fileBrowserView.ContextMenu.Rename": "XPATH://a[text()='Rename']",
        "fileBrowserView.ContextMenu.Delete": "XPATH://a[text()='Delete']",
        "fileBrowserView.ContextMenu.RemoveFromRecent": "XPATH://a[text()='Remove  from recent']",
    };
    const parseOperationRuleFromMatchRule = function (matchRule) {
        let rule = {
            selectType: "CSS",
            selectRule: "",
            controlType: "Text",
            attrList: [],
        };
        if (matchRule.startsWith("XPATH:")) {
            rule.selectType = "XPATH";
            matchRule = matchRule.replace("XPATH:", "");
        }
        if (matchRule.includes("->attr:")) {
            rule.controlType = "Attr";
            let ruleArr = matchRule.split("->attr:");
            if (ruleArr.length == 2) {
                rule.selectRule = ruleArr[0];
                let attrNodeStrList = ruleArr[1].split(",");
                for (let i = 0; i < attrNodeStrList.length; i++) {
                    const attrNodeStr = attrNodeStrList[i];
                    let attrNode = {
                        Key: "",
                        Value: "",
                    };
                    let attrS = attrNodeStr.split("=");
                    attrNode.Key = attrS[0];
                    if (attrS.length == 2) {
                        attrNode.Value = attrS[1];
                    }
                    rule.attrList.push(attrNode);
                }
            }
        }
        else {
            rule.selectRule = matchRule;
        }
        return rule;
    };
    const getTargetElement = function (originElements) {
        let matchElement = {};
        for (const element of originElements) {
            if (!element.querySelector) {
                continue;
            }
            for (const elementName in matchRuleDict) {
                if (!Object.prototype.hasOwnProperty.call(matchRuleDict, elementName)) {
                    continue;
                }
                let rule = parseOperationRuleFromMatchRule(matchRuleDict[elementName]);
                let target;
                if (rule.selectType == "XPATH") {
                    target = document.evaluate(rule.selectRule, element).iterateNext();
                }
                else {
                    target = element.querySelector(rule.selectRule);
                }
                if (!target) {
                    target = element.querySelector(`*[figma-i18n-id='${elementName}']`);
                }
                if (target && ((target === null || target === void 0 ? void 0 : target.nodeType) == 1 || (target === null || target === void 0 ? void 0 : target.nodeType) == 3)) {
                    matchElement[elementName] = {
                        type: rule.controlType,
                        node: target,
                        attrList: rule.attrList,
                    };
                }
            }
        }
        return matchElement;
    };

    var zhCn = {
        "fullscreenMenu.BackToFiles": "返回文件列表",
        "fullscreenMenu.QuickActions": "快速操作…",
        "fullscreenMenu.File": "文件",
        "fullscreenMenu.File.NewDesignFile": "新建设计文件",
        "fullscreenMenu.File.NewFigJamFile": "新建 FigJam 文件",
        "fullscreenMenu.File.NewFromSketchFile": "从 Sketch 文件新建…",
        "fullscreenMenu.File.PlaceImage": "导入图片…",
        "fullscreenMenu.File.ImportFromCSV": "从 CSV 中导入…",
        "fullscreenMenu.File.SaveLocalCopy": "保存本地副本…",
        "fullscreenMenu.File.SaveToVersionHistory": "保存至版本历史…",
        "fullscreenMenu.File.ShowVersionHistory": "查看版本历史",
        "fullscreenMenu.File.Export": "导出…",
        "fullscreenMenu.File.ExportFramesToPDF": "导出画框为 PDF…",
        "fullscreenMenu.File.ExportAs": "导出为…",
        "fullscreenMenu.File.ExportSelection": "导出选择…",
        "fullscreenMenu.Edit": "编辑",
        "fullscreenMenu.Edit.Undo": "撤销",
        "fullscreenMenu.Edit.Redo": "重做",
        "fullscreenMenu.Edit.CopyAs": "复制为",
        "fullscreenMenu.Edit.CopyAs.CopyAsText": "复制为文本",
        "fullscreenMenu.Edit.CopyAs.CopyAsCSS": "复制为 CSS",
        "fullscreenMenu.Edit.CopyAs.CopyAsSVG": "复制为 SVG",
        "fullscreenMenu.Edit.CopyAs.CopyAsPNG": "复制为 PNG",
        "fullscreenMenu.Edit.PasteOverSelection": "粘贴至所选位置",
        "fullscreenMenu.Edit.PasteToReplace": "粘贴替换",
        "fullscreenMenu.Edit.Duplicate": "创建副本",
        "fullscreenMenu.Edit.Delete": "删除",
        "fullscreenMenu.Edit.SetDefaultProperties": "设置默认属性",
        "fullscreenMenu.Edit.CopyProperties": "复制属性",
        "fullscreenMenu.Edit.PasteProperties": "粘贴属性",
        "fullscreenMenu.Edit.PickColor": "吸取颜色",
        "fullscreenMenu.Edit.SelectAll": "全选",
        "fullscreenMenu.Edit.SelectNone": "取消选择",
        "fullscreenMenu.Edit.SelectInverse": "反选",
        "fullscreenMenu.Edit.SelectAllWithSameProperties": "选择全部相同属性",
        "fullscreenMenu.Edit.SelectAllWithSameFill": "选择全部相同填充颜色",
        "fullscreenMenu.Edit.SelectAllWithSameStroke": "选择全部相同描边",
        "fullscreenMenu.Edit.SelectAllWithSameEffect": "选择全部相同效果",
        "fullscreenMenu.Edit.SelectAllWithSameTextProperties": "选择全部相同文本属性",
        "fullscreenMenu.Edit.SelectAllWithSameFont": "选择全部相同字体",
        "fullscreenMenu.Edit.SelectAllWithSameInstance": "选择全部相同组件实例",
        "fullscreenMenu.View": "查看",
        "fullscreenMenu.View.PixelGrid": "像素网格",
        "fullscreenMenu.View.LayoutGrids": "布局网格",
        "fullscreenMenu.View.Rulers": "标尺",
        "fullscreenMenu.View.ShowSlices": "显示切片",
        "fullscreenMenu.View.Comments": "评论",
        "fullscreenMenu.View.Outlines": "轮廓",
        "fullscreenMenu.View.PixelPreview": "像素预览",
        "fullscreenMenu.View.MaskOutlines": "蒙版轮廓",
        "fullscreenMenu.View.FrameOutlines": "画框轮廓",
        "fullscreenMenu.View.ShowDotGrid": "显示点状网格",
        "fullscreenMenu.View.ResourceUse": "资源使用情况",
        "fullscreenMenu.View.ShowOrHideUI": "显示/隐藏界面",
        "fullscreenMenu.View.MultiplayerCursors": "多人鼠标指针",
        "fullscreenMenu.View.Panels": "面板",
        "fullscreenMenu.View.Panels.OpenLayersPanel": "打开图层面板",
        "fullscreenMenu.View.Panels.OpenDesignPanel": "打开设计面板",
        "fullscreenMenu.View.Panels.OpenPrototypePanel": "打开原型面板",
        "fullscreenMenu.View.Panels.OpenInspectPanel": "打开检查面板",
        "fullscreenMenu.View.Panels.ShowLeftSidebar": "显示左侧边栏",
        "fullscreenMenu.View.ZoomIn": "放大",
        "fullscreenMenu.View.ZoomOut": "缩小",
        "fullscreenMenu.View.ZoomTo100%": "缩放至 100%",
        "fullscreenMenu.View.ZoomToFit": "缩放至适应大小",
        "fullscreenMenu.View.ZoomToSelection": "缩放至选中范围",
        "fullscreenMenu.View.PreviousPage": "上一页",
        "fullscreenMenu.View.NextPage": "下一页",
        "fullscreenMenu.View.ZoomToPreviousFrame": "缩放至上一个画框",
        "fullscreenMenu.View.ZoomToNextFrame": "缩放至下一个画框",
        "fullscreenMenu.View.FindPreviousFrame": "查找上一个画框",
        "fullscreenMenu.View.FindNextFrame": "查找下一个画框",
        "fullscreenMenu.Object": "对象",
        "fullscreenMenu.Object.GroupSelection": "对所选项进行编组",
        "fullscreenMenu.Object.CreateSection": "创建部件",
        "fullscreenMenu.Object.FrameSelection": "选择画框",
        "fullscreenMenu.Object.UngroupSelection": "取消对所选项进行编组",
        "fullscreenMenu.Object.UseAsMask": "设为蒙版",
        "fullscreenMenu.Object.RestoreDefaultThumbnail": "恢复默认封面",
        "fullscreenMenu.Object.SetAsThumbnail": "设为封面",
        "fullscreenMenu.Object.AddAutoLayout": "添加自动布局",
        "fullscreenMenu.Object.CreateComponent": "创建组件",
        "fullscreenMenu.Object.ResetAllOverrides": "重置所有覆盖",
        "fullscreenMenu.Object.DetachInstance": "分离实例",
        "fullscreenMenu.Object.MainComponent": "组件母版",
        "fullscreenMenu.Object.MainComponent.GoToMainComponent": "转到组件母版",
        "fullscreenMenu.Object.MainComponent.PushOverridesToMainComponent": "覆盖组件母版",
        "fullscreenMenu.Object.MainComponent.RestoreMainComponent": "恢复组件母版",
        "fullscreenMenu.Object.BringToFront": "移到顶层",
        "fullscreenMenu.Object.BringForward": "上移一层",
        "fullscreenMenu.Object.SendBackward": "下移一层",
        "fullscreenMenu.Object.SendToBack": "移到底层",
        "fullscreenMenu.Object.flipHorizontal": "水平翻转",
        "fullscreenMenu.Object.flipVertical": "垂直翻转",
        "fullscreenMenu.Object.Rotate180": "旋转 180°",
        "fullscreenMenu.Object.Rotate90Left": "向左旋转 90°",
        "fullscreenMenu.Object.Rotate90Right": "向右旋转 90°",
        "fullscreenMenu.Object.FlattenSelection": "拼合所选项",
        "fullscreenMenu.Object.OutlineStroke": "轮廓化描边",
        "fullscreenMenu.Object.BooleanGroups": "布尔组合",
        "fullscreenMenu.Object.BooleanGroups.UnionSelection": "连集所选项",
        "fullscreenMenu.Object.BooleanGroups.SubtractSelection": "减去所选项",
        "fullscreenMenu.Object.BooleanGroups.IntersectSelection": "交集所选项",
        "fullscreenMenu.Object.BooleanGroups.ExcludeSelection": "差集所选项",
        "fullscreenMenu.Object.RasterizeSelection": "像素化所选项",
        "fullscreenMenu.Object.ShowOrHideSelection": "显示/隐藏所选项",
        "fullscreenMenu.Object.LockOrUnlockSelection": "锁定/解锁所选项",
        "fullscreenMenu.Object.HideOtherLayers": "隐藏其余图层",
        "fullscreenMenu.Object.CollapseLayers": "折叠图层",
        "fullscreenMenu.Object.RemoveFill": "移除填充",
        "fullscreenMenu.Object.RemoveStroke": "移除描边",
        "fullscreenMenu.Object.SwapFillAndStroke": "交换填充和描边",
        "fullscreenMenu.Vector": "矢量",
        "fullscreenMenu.Vector.JoinSelection": "连接所选项",
        "fullscreenMenu.Vector.SmoothJoinSelection": "平滑连接所选项",
        "fullscreenMenu.Vector.DeleteAndHealSelection": "删除和修复所选项",
        "fullscreenMenu.Text": "文本",
        "fullscreenMenu.Text.Bold": "加粗",
        "fullscreenMenu.Text.Italic": "斜体",
        "fullscreenMenu.Text.Underline": "下划线",
        "fullscreenMenu.Text.Strikethrough": "删除线",
        "fullscreenMenu.Text.CreateLink": "创建链接",
        "fullscreenMenu.Text.BulletedList": "无序列表",
        "fullscreenMenu.Text.NumberedList": "有序列表",
        "fullscreenMenu.Text.Alignment": "对齐",
        "fullscreenMenu.Text.Alignment.TextAlignLeft": "左对齐",
        "fullscreenMenu.Text.Alignment.TextAlignCenter": "水平居中",
        "fullscreenMenu.Text.Alignment.TextAlignRight": "右对齐",
        "fullscreenMenu.Text.Alignment.TextAlignJustified": "两端对齐",
        "fullscreenMenu.Text.Alignment.TextAlignTop": "上对齐",
        "fullscreenMenu.Text.Alignment.TextAlignMiddle": "垂直居中",
        "fullscreenMenu.Text.Alignment.TextAlignBottom": "下对齐",
        "fullscreenMenu.Text.Adjust": "调整",
        "fullscreenMenu.Text.Adjust.IncreaseIndentation": "增大缩进",
        "fullscreenMenu.Text.Adjust.DecreaseIndentation": "减小缩进",
        "fullscreenMenu.Text.Adjust.IncreaseFontSize": "增大字号",
        "fullscreenMenu.Text.Adjust.DecreaseFontSize": "减小字号",
        "fullscreenMenu.Text.Adjust.IncreaseFontWeight": "增大字重",
        "fullscreenMenu.Text.Adjust.DecreaseFontWeight": "减小字重",
        "fullscreenMenu.Text.Adjust.IncreaseLineHeight": "增大行高",
        "fullscreenMenu.Text.Adjust.DecreaseLineHeight": "减小行高",
        "fullscreenMenu.Text.Adjust.IncreaseLetterSpacing": "增大字距",
        "fullscreenMenu.Text.Adjust.DecreaseLetterSpacing": "减小字距",
        "fullscreenMenu.Text.Case": "大小写",
        "fullscreenMenu.Text.Case.OriginalCase": "初始大小写",
        "fullscreenMenu.Text.Case.Uppercase": "大写",
        "fullscreenMenu.Text.Case.Lowercase": "小写",
        "fullscreenMenu.Arrange": "排列",
        "fullscreenMenu.Arrange.RoundToPixel": "对齐像素",
        "fullscreenMenu.Arrange.AlignLeft": "左对齐",
        "fullscreenMenu.Arrange.AlignHorizontalCenters": "水平居中",
        "fullscreenMenu.Arrange.AlignRight": "右对齐",
        "fullscreenMenu.Arrange.AlignTop": "上对齐",
        "fullscreenMenu.Arrange.AlignVerticalCenters": "垂直居中",
        "fullscreenMenu.Arrange.AlignBottom": "下对齐",
        "fullscreenMenu.Arrange.TidyUp": "整理",
        "fullscreenMenu.Arrange.PackHorizontal": "水平堆叠",
        "fullscreenMenu.Arrange.PackVertical": "垂直堆叠",
        "fullscreenMenu.Arrange.DistributeHorizontalSpacing": "水平间距均分",
        "fullscreenMenu.Arrange.DistributeVerticalSpacing": "垂直间距均分",
        "fullscreenMenu.Arrange.DistributeLeft": "向左均分",
        "fullscreenMenu.Arrange.DistributeHorizontalCenters": "水平中心均分",
        "fullscreenMenu.Arrange.DistributeRight": "向右均分",
        "fullscreenMenu.Arrange.DistributeTop": "向上均分",
        "fullscreenMenu.Arrange.DistributeVerticalCenters": "垂直中心均分",
        "fullscreenMenu.Arrange.DistributeBottom": "向下均分",
        "fullscreenMenu.Plugins": "插件",
        "fullscreenMenu.Plugins.RunLastPlugin": "运行上一个插件",
        "fullscreenMenu.Plugins.ManagePlugins": "管理插件…",
        "fullscreenMenu.Plugins.BrowsePluginsInCommunity": "在社区中浏览插件",
        "fullscreenMenu.Plugins.BrowsePlugins": "浏览插件",
        "fullscreenMenu.Widgets": "小部件",
        "fullscreenMenu.Widgets.BrowseWidgets": "浏览小部件",
        "fullscreenMenu.Widgets.SelectAllWidgets": "选择所有小部件",
        "fullscreenMenu.Integrations": "集成",
        "fullscreenMenu.Integrations.Dribbble": "Dribbble",
        "fullscreenMenu.Preferences": "偏好设置",
        "fullscreenMenu.Preferences.SnapToGeometry": "对齐到形状",
        "fullscreenMenu.Preferences.SnapToObjects": "对齐到对象",
        "fullscreenMenu.Preferences.SnapToDotGrid": "对齐到点状网格",
        "fullscreenMenu.Preferences.SnapToPixelGrid": "对齐到像素",
        "fullscreenMenu.Preferences.KeepToolSelectedAfterUse": "使用后保持工具选择",
        "fullscreenMenu.Preferences.HighlightLayersOnHover": "突出显示悬停图层",
        "fullscreenMenu.Preferences.RenameDuplicatedLayers": "重命名已创建的副本图层",
        "fullscreenMenu.Preferences.ShowDimensionsOnObjects": "在对象上显示尺寸",
        "fullscreenMenu.Preferences.HideCanvasUIDuringChanges": "在改动期间隐藏画布 UI",
        "fullscreenMenu.Preferences.KeyboardZoomsIntoSelection": "键盘缩放所选项",
        "fullscreenMenu.Preferences.SubstituteSmartQuotes": "智能引号替换",
        "fullscreenMenu.Preferences.ShowGoogleFonts": "显示谷歌字体",
        "fullscreenMenu.Preferences.FlipObjectsWhileResizing": "调整大小时翻转对象",
        "fullscreenMenu.Preferences.InvertZoomDirection": "反转缩放方向",
        "fullscreenMenu.Preferences.UseNumberKeysForOpacity": "使用数字控制透明度",
        "fullscreenMenu.Preferences.ShakeCursorForHighFive": "摇动光标进行挥手",
        "fullscreenMenu.Preferences.OpenLinksInDesktopApp": "在桌面应用打开链接",
        "fullscreenMenu.Preferences.NudgeAmount": "微调量…",
        "fullscreenMenu.Preferences.ShowTemplatesForNewFiles": "显示新文件的模版",
        "fullscreenMenu.Libraries": "组件库",
        "fullscreenMenu.GetDesktopApp": "下载桌面版应用",
        "fullscreenMenu.OpenInDesktopApp": "在桌面应用中打开",
        "fullscreenMenu.HelpAndAccount": "帮助和账户",
        "fullscreenMenu.HelpAndAccount.HelpPage": "帮助页面",
        "fullscreenMenu.HelpAndAccount.KeyboardShortcuts": "键盘快捷键",
        "fullscreenMenu.HelpAndAccount.SupportForum": "支持论坛",
        "fullscreenMenu.HelpAndAccount.VideoTutorials": "视频教程",
        "fullscreenMenu.HelpAndAccount.ReleaseNotes": "版本说明",
        "fullscreenMenu.HelpAndAccount.OpenFontSettings": "打开字体设置",
        "fullscreenMenu.HelpAndAccount.LegalSummary": "法律摘要",
        "fullscreenMenu.HelpAndAccount.AccountSettings": "账号设置",
        "fullscreenMenu.HelpAndAccount.LogOut": "退出",
        "fullscreenMenu.PublishStylesAndComponents": "发布样式和组件",
        "fullscreenMenu.Rename": "重命名",
        "fullscreenMenu.MoveToProject": "移动到项目…",
        "fullscreenMenu.Delete": "删除…",
        "fullscreenMenu.ZoomTo50": "缩放至 50%",
        "fullscreenMenu.ZoomTo200": "缩放至 200%",
        "fullscreenMenu.Disabled": "禁用",
        "fullscreenMenu.Tooltip.MainMenu": "主菜单",
        "fullscreenMenu.Tooltip.MoveTools": "移动工具",
        "fullscreenMenu.Tooltip.SetToolDefault": "移动 V",
        "fullscreenMenu.Tooltip.SetToolScale": "缩放 K",
        "fullscreenMenu.Tooltip.RegionTools": "区域工具",
        "fullscreenMenu.Tooltip.SetToolFrame": "画框 F",
        "fullscreenMenu.Tooltip.SetToolSlice": "切片 S",
        "fullscreenMenu.Tooltip.ShapeTools": "形状工具",
        "fullscreenMenu.Tooltip.SetToolRectangle": "矩形 R",
        "fullscreenMenu.Tooltip.SetToolLine": "直线 L",
        "fullscreenMenu.Tooltip.SetToolArrow": "箭头 Shift+L",
        "fullscreenMenu.Tooltip.SetToolEllipse": "椭圆 O",
        "fullscreenMenu.Tooltip.SetToolRegularPolygon": "多边形",
        "fullscreenMenu.Tooltip.SetToolStar": "星形",
        "fullscreenMenu.Tooltip.DrawingTools": "绘画工具",
        "fullscreenMenu.Tooltip.SetToolPen": "钢笔 P",
        "fullscreenMenu.Tooltip.SetToolPencil": "铅笔 Shift+P",
        "fullscreenMenu.Tooltip.SetToolText": "文本 T",
        "fullscreenMenu.Tooltip.SetToolHand": "抓手工具 H",
        "fullscreenMenu.Tooltip.SetToolComments": "添加评论 C",
        "fullscreenMenu.Tooltip.Present": "演示",
        "fullscreenMenu.Tooltip.CreateComponent": "创建组件 Ctrl+Alt+K",
        "fullscreenMenu.Tooltip.UseAsMask": "设为蒙版 Ctrl+Alt+M",
        "fullscreenMenu.Tooltip.BooleanGroups": "布尔组合",
        "fullscreenMenu.Tooltip.UnionSelection": "连集所选项",
        "fullscreenMenu.Tooltip.SubtractSelection": "减去所选项",
        "fullscreenMenu.Tooltip.IntersectSelection": "交集所选项",
        "fullscreenMenu.Tooltip.ExcludeSelection": "差集所选项",
        "toolbarView.fileName.folderName.Drafts": "草稿",
        "toolbarView.moveFlyout.flyout.toolDefault": "移动",
        "toolbarView.moveFlyout.flyout.toolScale": "缩放",
        "toolbarView.regionFlyout.flyout.toolFrame": "画框",
        "toolbarView.regionFlyout.flyout.toolSlice": "切片",
        "toolbarView.shapeFlyout.flyout.toolShapeRectangle": "矩形",
        "toolbarView.shapeFlyout.flyout.toolShapeLine": "直线",
        "toolbarView.shapeFlyout.flyout.toolShapeArrow": "箭头",
        "toolbarView.shapeFlyout.flyout.toolShapeEllipse": "椭圆",
        "toolbarView.shapeFlyout.flyout.toolShapePolygon": "多边形",
        "toolbarView.shapeFlyout.flyout.toolShapeStar": "星形",
        "toolbarView.shapeFlyout.flyout.toolPlaceImage": "导入图片…",
        "toolbarView.penFlyout.flyout.toolPen": "钢笔",
        "toolbarView.penFlyout.flyout.toolPencil": "铅笔",
        "toolbarView.booleanFlyout.flyout.toolBooleanUnion": "连集所选项",
        "toolbarView.booleanFlyout.flyout.toolBooleanSubtract": "减去所选项",
        "toolbarView.booleanFlyout.flyout.toolBooleanIntersect": "交集所选项",
        "toolbarView.booleanFlyout.flyout.toolBooleatoolBooleanXornUnion": "差集所选项",
        "toolbarView.booleanFlyout.flyout.toolFlatten": "展平所选项",
        "toolbarView.Share": "分享",
        "toolbarView.CursorChat": "聚焦聊天框",
        "toolbarView.Stamp": "印章",
        "toolbarView.Emote": "表情",
        "toolbarView.Overflow.Emote": "表情",
        "toolbarView.Overflow.Stamp": "印章",
        "toolbarView.Overflow.CursorChat": "聚焦聊天框",
        "toolbarView.Overflow.HighFive": "挥手",
        "toolbarView.Overflow.Timer": "计时器",
        "toolbarView.Tooltip.Collaborate": "协作",
        "toolbarView.Tooltip.ZoomOut": "缩小 Ctrl+-",
        "toolbarView.Tooltip.ZoomIn": "放大 Ctrl+-",
        "toolbarView.Tooltip.ZoomOrViewOptions": "缩放/视图选项",
        "delightfulToolbar.MoveTool": "移动工具 V",
        "delightfulToolbar.HandTool": "抓手工具 H",
        "delightfulToolbar.Marker": "马克笔 M",
        "delightfulToolbar.Highlighter": "荧光笔 Shift+M",
        "delightfulToolbar.Eraser": "橡皮擦 Shift+Backspace",
        "delightfulToolbar.Thin": "细",
        "delightfulToolbar.Thick": "粗",
        "delightfulToolbar.Charcoal": "炭黑",
        "delightfulToolbar.Red": "红",
        "delightfulToolbar.Yellow": "黄",
        "delightfulToolbar.Green": "绿",
        "delightfulToolbar.Blue": "蓝",
        "delightfulToolbar.Violet": "紫",
        "delightfulToolbar.Brown": "棕",
        "delightfulToolbar.White": "白",
        "delightfulToolbar.Square": "方形 R",
        "delightfulToolbar.Ellipse": "椭圆 O",
        "delightfulToolbar.RoundedRectangle": "圆角矩形",
        "delightfulToolbar.Diamond": "菱形",
        "delightfulToolbar.TriangleUp": "三角形",
        "delightfulToolbar.TriangleDown": "三角形",
        "delightfulToolbar.ParallelogramRight": "平行四边形",
        "delightfulToolbar.ParallelogramLeft": "平行四边形",
        "delightfulToolbar.Cylinder": "圆柱体",
        "delightfulToolbar.HorizontalCylinder": "横向圆柱体",
        "delightfulToolbar.File": "文件",
        "delightfulToolbar.Folder": "文件夹",
        "delightfulToolbar.Options.Square": "方形",
        "delightfulToolbar.Options.Ellipse": "椭圆",
        "delightfulToolbar.Options.RoundedRectangle": "圆角矩形",
        "delightfulToolbar.Options.Diamond": "菱形",
        "delightfulToolbar.Options.Triangle": "三角形",
        "delightfulToolbar.Options.DownwardPointingTriangle": "倒三角形",
        "delightfulToolbar.Options.RightLeaningParallelogram": "右倾的平行四边形",
        "delightfulToolbar.Options.LeftLeaningParallelogram": "左倾的平行四边形",
        "delightfulToolbar.Options.Cylinder": "圆柱体",
        "delightfulToolbar.Options.HorizontalCylinder": "横向圆柱体",
        "delightfulToolbar.Options.File": "文件",
        "delightfulToolbar.Options.Folder": "文件夹",
        "delightfulToolbar.Sticky": "便利贴 S",
        "delightfulToolbar.Text": "文本 T",
        "delightfulToolbar.Connector": "连线 X",
        "delightfulToolbar.Line": "直线 L",
        "delightfulToolbar.Options.Connector": "连线",
        "delightfulToolbar.Options.StraightLine": "直线",
        "delightfulToolbar.Stamp": "印章 E",
        "delightfulToolbar.More": "小部件、贴纸、模板以及更多",
        "contextMenu.Copy": "复制",
        "contextMenu.Paste": "粘贴",
        "contextMenu.PasteHere": "粘贴到这里",
        "contextMenu.CopyOrPasteAs": "复制/粘贴为",
        "contextMenu.CopyOrPasteAs.CopyLink": "复制链接",
        "contextMenu.SelectLayer": "选择图层",
        "contextMenu.MoveToPage": "移到页面",
        "contextMenu.Ungroup": "取消编组",
        "contextMenu.Flatten": "拼合",
        "contextMenu.ShowOrHide": "显示/隐藏",
        "contextMenu.LockOrUnlock": "锁定/解锁",
        "contextMenu.ShowOrHideComments": "显示/隐藏评论",
        "pagesPanel.Sidebar.Tab": "图层",
        "pagesPanel.Sidebar.AssetsTab": "资源",
        "pagesPanel.Sidebar.Pages": "页面",
        "pagesPanel.Sidebar.Pages.CopyLinkToPage": "复制页面链接",
        "pagesPanel.Sidebar.Pages.DeletePage": "删除页面",
        "pagesPanel.Sidebar.Pages.RenamePage": "重命名页面",
        "pagesPanel.Sidebar.Pages.DuplicatePage": "创建页面副本",
        "pagesPanel.Sidebar.AddNewPage": "添加新页面",
        "pagesPanel.Sidebar.Search": "搜索",
        "pagesPanel.Sidebar.ShowAsList": "显示为列表",
        "pagesPanel.Sidebar.ShowAsGrid": "显示为网格",
        "pagesPanel.Sidebar.TeamLibrary": "团队组件库",
        "pagesPanel.Sidebar.Components": "组件",
        "pagesPanel.Sidebar.Components.FirstInfoText": "如果要创建组件,请选择一个图层,然后单击工具栏中的「创建组件」按钮。",
        "pagesPanel.Sidebar.Components.FirstInfoLink": "了解更多",
        "pagesPanel.Sidebar.Components.SecondInfoText": "使用组件库可以快速访问其他文件中的组件。",
        "pagesPanel.Sidebar.Components.SecondInfoLink": "查看组件库…",
        "propertiesPanel.TabsHeader.Design": "设计",
        "propertiesPanel.TabsHeader.Prototype": "原型",
        "propertiesPanel.TabsHeader.Inspect": "检查",
        "navbar.Community": "社区",
        "navbar.Search": "搜索文件、团队或人员",
        "navbar.Notifications": "通知",
        "navbar.InternalProfile": "内部简介",
        "navbar.Settings": "设置",
        "navbar.AddAccount": "添加账户",
        "sidebar.Recents": "最近",
        "sidebar.Drafts": "草稿",
        "sidebar.ExploreCommunity": "探索社区",
        "sidebar.TeamProject": "团队项目",
        "sidebar.CreateNewTeam": "创建新的团队",
        "fileBrowserView.RecentlyViewed": "最近浏览过",
        "fileBrowserView.Drafts": "草稿",
        "fileBrowserView.Deleted": "已删除",
        "fileBrowserView.NewDesignFile": "新建设计文件",
        "fileBrowserView.NewDesignFile.Desc": "设计和原型",
        "fileBrowserView.NewFigJamFile": "新建 FigJam 文件",
        "fileBrowserView.NewFigJamFile.Desc": "白板和图表",
        "fileBrowserView.ImportFile": "导入文件",
        "fileBrowserView.ImportFile.Desc": "Figma、Sketch 和图片文件",
        "fileBrowserView.Filter": "筛选:",
        "fileBrowserView.Filter.Select.AllFiles": "全部文件",
        "fileBrowserView.Filter.Select.DesignFiles": "设计文件",
        "fileBrowserView.Filter.Select.FigJamFiles": "FigJam 文件",
        "fileBrowserView.Filter.Select.Prototypes": "原型",
        "fileBrowserView.Sort": "排序:",
        "fileBrowserView.Sort.Select.SortBy": "排序方式",
        "fileBrowserView.Sort.Select.Alphabetical": "字母顺序",
        "fileBrowserView.Sort.Select.DateCreated": "创建时间",
        "fileBrowserView.Sort.Select.LastViewed": "最近浏览",
        "fileBrowserView.Sort.Select.LastModified": "最近编辑",
        "fileBrowserView.Sort.Select.Order": "排序",
        "fileBrowserView.Sort.Select.OldestFirst": "最早",
        "fileBrowserView.Sort.Select.NewestFirst": "最新",
        "fileBrowserView.ShowAsGrid": "显示为网格",
        "fileBrowserView.ShowAsList": "显示为列表",
        "fileBrowserView.ContextMenu.ShowInProject": "在项目中显示",
        "fileBrowserView.ContextMenu.Open": "打开",
        "fileBrowserView.ContextMenu.OpenInNewTab": "在新标签页中打开",
        "fileBrowserView.ContextMenu.CopyLink": "复制链接",
        "fileBrowserView.ContextMenu.AddToYourFavorites": "添加到你的收藏",
        "fileBrowserView.ContextMenu.Share": "分享",
        "fileBrowserView.ContextMenu.Duplicate": "创建副本",
        "fileBrowserView.ContextMenu.Rename": "重命名",
        "fileBrowserView.ContextMenu.Delete": "删除",
        "fileBrowserView.ContextMenu.RemoveFromRecent": "从最近中移除",
    };

    var en = {
        "fullscreenMenu.BackToFiles": "Back to files",
        "fullscreenMenu.QuickActions": "Quick actions…",
        "fullscreenMenu.File": "File",
        "fullscreenMenu.File.NewDesignFile": "New design file",
        "fullscreenMenu.File.NewFigJamFile": "New FigJam file",
        "fullscreenMenu.File.NewFromSketchFile": "New from Sketch file…",
        "fullscreenMenu.File.PlaceImage": "Place image...",
        "fullscreenMenu.File.ImportFromCSV": "Import from CSV…",
        "fullscreenMenu.File.SaveLocalCopy": "Save local copy…",
        "fullscreenMenu.File.SaveToVersionHistory": "Save to version history…",
        "fullscreenMenu.File.ShowVersionHistory": "Show version history",
        "fullscreenMenu.File.Export": "Export…",
        "fullscreenMenu.File.ExportFramesToPDF": "Export frames to PDF…",
        "fullscreenMenu.File.ExportAs": "Export as…",
        "fullscreenMenu.File.ExportSelection": "Export selection…",
        "fullscreenMenu.Edit": "Edit",
        "fullscreenMenu.Edit.Undo": "Undo",
        "fullscreenMenu.Edit.Redo": "Redo",
        "fullscreenMenu.Edit.CopyAs": "Copy as",
        "fullscreenMenu.Edit.CopyAs.CopyAsText": "Copy as text",
        "fullscreenMenu.Edit.CopyAs.CopyAsCSS": "Copy as CSS",
        "fullscreenMenu.Edit.CopyAs.CopyAsSVG": "Copy as SVG",
        "fullscreenMenu.Edit.CopyAs.CopyAsPNG": "Copy as PNG",
        "fullscreenMenu.Edit.PasteOverSelection": "Paste over selection",
        "fullscreenMenu.Edit.PasteToReplace": "Paste to replace",
        "fullscreenMenu.Edit.Duplicate": "Duplicate",
        "fullscreenMenu.Edit.Delete": "Delete",
        "fullscreenMenu.Edit.SetDefaultProperties": "Set default properties",
        "fullscreenMenu.Edit.CopyProperties": "Copy properties",
        "fullscreenMenu.Edit.PasteProperties": "Paste properties",
        "fullscreenMenu.Edit.PickColor": "Pick color",
        "fullscreenMenu.Edit.SelectAll": "Select all",
        "fullscreenMenu.Edit.SelectNone": "Select none",
        "fullscreenMenu.Edit.SelectInverse": "Select inverse",
        "fullscreenMenu.Edit.SelectAllWithSameProperties": "Select all with same properties",
        "fullscreenMenu.Edit.SelectAllWithSameFill": "Select all with same fill",
        "fullscreenMenu.Edit.SelectAllWithSameStroke": "Select all with same stroke",
        "fullscreenMenu.Edit.SelectAllWithSameEffect": "Select all with same effect",
        "fullscreenMenu.Edit.SelectAllWithSameTextProperties": "Select all with same text properties",
        "fullscreenMenu.Edit.SelectAllWithSameFont": "Select all with same font",
        "fullscreenMenu.Edit.SelectAllWithSameInstance": "Select all with same instance",
        "fullscreenMenu.View": "View",
        "fullscreenMenu.View.PixelGrid": "Pixel grid",
        "fullscreenMenu.View.LayoutGrids": "Layout grids",
        "fullscreenMenu.View.Rulers": "Rulers",
        "fullscreenMenu.View.ShowSlices": "Show slices",
        "fullscreenMenu.View.Comments": "Comments",
        "fullscreenMenu.View.Outlines": "Outlines",
        "fullscreenMenu.View.PixelPreview": "Pixel preview",
        "fullscreenMenu.View.MaskOutlines": "Mask outlines",
        "fullscreenMenu.View.FrameOutlines": "Frame outlines",
        "fullscreenMenu.View.ShowDotGrid": "Show dot grid",
        "fullscreenMenu.View.ResourceUse": "Resource use",
        "fullscreenMenu.View.ShowOrHideUI": "Show/Hide UI",
        "fullscreenMenu.View.MultiplayerCursors": "Multiplayer cursors",
        "fullscreenMenu.View.Panels": "Panels",
        "fullscreenMenu.View.Panels.OpenLayersPanel": "Open layers panel",
        "fullscreenMenu.View.Panels.OpenDesignPanel": "Open design panel",
        "fullscreenMenu.View.Panels.OpenPrototypePanel": "Open prototype panel",
        "fullscreenMenu.View.Panels.OpenInspectPanel": "Open inspect panel",
        "fullscreenMenu.View.Panels.ShowLeftSidebar": "Show left sidebar",
        "fullscreenMenu.View.ZoomIn": "Zoom in",
        "fullscreenMenu.View.ZoomOut": "Zoom out",
        "fullscreenMenu.View.ZoomTo100%": "Zoom to 100%",
        "fullscreenMenu.View.ZoomToFit": "Zoom to fit",
        "fullscreenMenu.View.ZoomToSelection": "Zoom to selection",
        "fullscreenMenu.View.PreviousPage": "Previous page",
        "fullscreenMenu.View.NextPage": "Next page",
        "fullscreenMenu.View.ZoomToPreviousFrame": "Zoom to previous frame",
        "fullscreenMenu.View.ZoomToNextFrame": "Zoom to next frame",
        "fullscreenMenu.View.FindPreviousFrame": "Find previous frame",
        "fullscreenMenu.View.FindNextFrame": "Find next frame",
        "fullscreenMenu.Object": "Object",
        "fullscreenMenu.Object.GroupSelection": "Group selection",
        "fullscreenMenu.Object.CreateSection": "Create section",
        "fullscreenMenu.Object.FrameSelection": "Frame selection",
        "fullscreenMenu.Object.UngroupSelection": "Ungroup selection",
        "fullscreenMenu.Object.UseAsMask": "Use as mask",
        "fullscreenMenu.Object.RestoreDefaultThumbnail": "Restore default thumbnail",
        "fullscreenMenu.Object.SetAsThumbnail": "Set as thumbnail",
        "fullscreenMenu.Object.AddAutoLayout": "Add auto layout",
        "fullscreenMenu.Object.CreateComponent": "Create component",
        "fullscreenMenu.Object.ResetAllOverrides": "Reset all overrides",
        "fullscreenMenu.Object.DetachInstance": "Detach instance",
        "fullscreenMenu.Object.MainComponent": "Main component",
        "fullscreenMenu.Object.MainComponent.GoToMainComponent": "Go to main component",
        "fullscreenMenu.Object.MainComponent.PushOverridesToMainComponent": "Push overrides to main component",
        "fullscreenMenu.Object.MainComponent.RestoreMainComponent": "Restore main component",
        "fullscreenMenu.Object.BringToFront": "Bring to front",
        "fullscreenMenu.Object.BringForward": "Bring forward",
        "fullscreenMenu.Object.SendBackward": "Send backward",
        "fullscreenMenu.Object.SendToBack": "Send to back",
        "fullscreenMenu.Object.flipHorizontal": "Flip horizontal",
        "fullscreenMenu.Object.flipVertical": "Flip vertical",
        "fullscreenMenu.Object.Rotate180": "Rotate 180˚",
        "fullscreenMenu.Object.Rotate90Left": "Rotate 90˚ left",
        "fullscreenMenu.Object.Rotate90Right": "Rotate 90˚ right",
        "fullscreenMenu.Object.FlattenSelection": "Flatten selection",
        "fullscreenMenu.Object.OutlineStroke": "Outline stroke",
        "fullscreenMenu.Object.BooleanGroups": "Boolean groups",
        "fullscreenMenu.Object.BooleanGroups.UnionSelection": "Union selection",
        "fullscreenMenu.Object.BooleanGroups.SubtractSelection": "Subtract selection",
        "fullscreenMenu.Object.BooleanGroups.IntersectSelection": "Intersect selection",
        "fullscreenMenu.Object.BooleanGroups.ExcludeSelection": "Exclude selection",
        "fullscreenMenu.Object.RasterizeSelection": "Rasterize selection",
        "fullscreenMenu.Object.ShowOrHideSelection": "Show/Hide selection",
        "fullscreenMenu.Object.LockOrUnlockSelection": "Lock/Unlock selection",
        "fullscreenMenu.Object.HideOtherLayers": "Hide other layers",
        "fullscreenMenu.Object.CollapseLayers": "Collapse layers",
        "fullscreenMenu.Object.RemoveFill": "Remove fill",
        "fullscreenMenu.Object.RemoveStroke": "Remove stroke",
        "fullscreenMenu.Object.SwapFillAndStroke": "Swap fill and stroke",
        "fullscreenMenu.Vector": "Vector",
        "fullscreenMenu.Vector.JoinSelection": "Join selection",
        "fullscreenMenu.Vector.SmoothJoinSelection": "Smooth join selection",
        "fullscreenMenu.Vector.DeleteAndHealSelection": "Delete and heal selection",
        "fullscreenMenu.Text": "Text",
        "fullscreenMenu.Text.Bold": "Bold",
        "fullscreenMenu.Text.Italic": "Italic",
        "fullscreenMenu.Text.Underline": "Underline",
        "fullscreenMenu.Text.Strikethrough": "Strikethrough",
        "fullscreenMenu.Text.CreateLink": "Create link",
        "fullscreenMenu.Text.BulletedList": "Bulleted list",
        "fullscreenMenu.Text.NumberedList": "Numbered list",
        "fullscreenMenu.Text.Alignment": "Alignment",
        "fullscreenMenu.Text.Alignment.TextAlignLeft": "Text align left",
        "fullscreenMenu.Text.Alignment.TextAlignCenter": "Text align center",
        "fullscreenMenu.Text.Alignment.TextAlignRight": "Text align right",
        "fullscreenMenu.Text.Alignment.TextAlignJustified": "Text align justified",
        "fullscreenMenu.Text.Alignment.TextAlignTop": "Text align top",
        "fullscreenMenu.Text.Alignment.TextAlignMiddle": "Text align middle",
        "fullscreenMenu.Text.Alignment.TextAlignBottom": "Text align bottom",
        "fullscreenMenu.Text.Adjust": "Adjust",
        "fullscreenMenu.Text.Adjust.IncreaseIndentation": "Increase indentation",
        "fullscreenMenu.Text.Adjust.DecreaseIndentation": "Decrease indentation",
        "fullscreenMenu.Text.Adjust.IncreaseFontSize": "Increase font size",
        "fullscreenMenu.Text.Adjust.DecreaseFontSize": "Decrease font size",
        "fullscreenMenu.Text.Adjust.IncreaseFontWeight": "Increase font weight",
        "fullscreenMenu.Text.Adjust.DecreaseFontWeight": "Decrease font weight",
        "fullscreenMenu.Text.Adjust.IncreaseLineHeight": "Increase line height",
        "fullscreenMenu.Text.Adjust.DecreaseLineHeight": "Decrease line height",
        "fullscreenMenu.Text.Adjust.IncreaseLetterSpacing": "Increase letter spacing",
        "fullscreenMenu.Text.Adjust.DecreaseLetterSpacing": "Decrease letter spacing",
        "fullscreenMenu.Text.Case": "Case",
        "fullscreenMenu.Text.Case.OriginalCase": "Original case",
        "fullscreenMenu.Text.Case.Uppercase": "Uppercase",
        "fullscreenMenu.Text.Case.Lowercase": "Lowercase",
        "fullscreenMenu.Arrange": "Arrange",
        "fullscreenMenu.Arrange.RoundToPixel": "Round to pixel",
        "fullscreenMenu.Arrange.AlignLeft": "Align left",
        "fullscreenMenu.Arrange.AlignHorizontalCenters": "Align horizontal centers",
        "fullscreenMenu.Arrange.AlignRight": "Align right",
        "fullscreenMenu.Arrange.AlignTop": "Align top",
        "fullscreenMenu.Arrange.AlignVerticalCenters": "Align vertical centers",
        "fullscreenMenu.Arrange.AlignBottom": "Align bottom",
        "fullscreenMenu.Arrange.TidyUp": "Tidy up",
        "fullscreenMenu.Arrange.PackHorizontal": "Pack horizontal",
        "fullscreenMenu.Arrange.PackVertical": "Pack vertical",
        "fullscreenMenu.Arrange.DistributeHorizontalSpacing": "Distribute horizontal spacing",
        "fullscreenMenu.Arrange.DistributeVerticalSpacing": "Distribute vertical spacing",
        "fullscreenMenu.Arrange.DistributeLeft": "Distribute left",
        "fullscreenMenu.Arrange.DistributeHorizontalCenters": "Distribute horizontal centers",
        "fullscreenMenu.Arrange.DistributeRight": "Distribute right",
        "fullscreenMenu.Arrange.DistributeTop": "Distribute top",
        "fullscreenMenu.Arrange.DistributeVerticalCenters": "Distribute vertical centers",
        "fullscreenMenu.Arrange.DistributeBottom": "Distribute bottom",
        "fullscreenMenu.Plugins": "Plugins",
        "fullscreenMenu.Plugins.RunLastPlugin": "Run last plugin",
        "fullscreenMenu.Plugins.ManagePlugins": "Manage plugins…",
        "fullscreenMenu.Plugins.BrowsePluginsInCommunity": "Browse plugins in Community",
        "fullscreenMenu.Plugins.BrowsePlugins": "Browse plugins",
        "fullscreenMenu.Widgets": "Widgets",
        "fullscreenMenu.Widgets.BrowseWidgets": "Browse widgets",
        "fullscreenMenu.Widgets.SelectAllWidgets": "Select all widgets",
        "fullscreenMenu.Integrations": "Integrations",
        "fullscreenMenu.Integrations.Dribbble": "Dribbble",
        "fullscreenMenu.Preferences": "Preferences",
        "fullscreenMenu.Preferences.SnapToGeometry": "Snap to geometry",
        "fullscreenMenu.Preferences.SnapToObjects": "Snap to objects",
        "fullscreenMenu.Preferences.SnapToDotGrid": "Snap to dot grid",
        "fullscreenMenu.Preferences.SnapToPixelGrid": "Snap to pixel grid",
        "fullscreenMenu.Preferences.KeepToolSelectedAfterUse": "Keep tool selected after use",
        "fullscreenMenu.Preferences.HighlightLayersOnHover": "Highlight layers on hover",
        "fullscreenMenu.Preferences.RenameDuplicatedLayers": "Rename duplicated layers",
        "fullscreenMenu.Preferences.ShowDimensionsOnObjects": "Show dimensions on objects",
        "fullscreenMenu.Preferences.HideCanvasUIDuringChanges": "Hide canvas UI during changes",
        "fullscreenMenu.Preferences.KeyboardZoomsIntoSelection": "Keyboard zooms into selection",
        "fullscreenMenu.Preferences.SubstituteSmartQuotes": "Substitute smart quotes",
        "fullscreenMenu.Preferences.ShowGoogleFonts": "Show Google Fonts",
        "fullscreenMenu.Preferences.FlipObjectsWhileResizing": "Flip objects while resizing",
        "fullscreenMenu.Preferences.InvertZoomDirection": "Invert zoom direction",
        "fullscreenMenu.Preferences.UseNumberKeysForOpacity": "Use number keys for opacity",
        "fullscreenMenu.Preferences.ShakeCursorForHighFive": "Shake cursor for high five",
        "fullscreenMenu.Preferences.OpenLinksInDesktopApp": "Open links in desktop app",
        "fullscreenMenu.Preferences.NudgeAmount": "Nudge amount…",
        "fullscreenMenu.Preferences.ShowTemplatesForNewFiles": "Show templates for new files",
        "fullscreenMenu.Libraries": "Libraries",
        "fullscreenMenu.GetDesktopApp": "Get desktop app",
        "fullscreenMenu.OpenInDesktopApp": "Open in desktop app",
        "fullscreenMenu.HelpAndAccount": "Help and account",
        "fullscreenMenu.HelpAndAccount.HelpPage": "Help page",
        "fullscreenMenu.HelpAndAccount.KeyboardShortcuts": "Keyboard shortcuts",
        "fullscreenMenu.HelpAndAccount.SupportForum": "Support forum",
        "fullscreenMenu.HelpAndAccount.VideoTutorials": "Video tutorials",
        "fullscreenMenu.HelpAndAccount.ReleaseNotes": "Release notes",
        "fullscreenMenu.HelpAndAccount.OpenFontSettings": "Open font settings",
        "fullscreenMenu.HelpAndAccount.LegalSummary": "Legal summary",
        "fullscreenMenu.HelpAndAccount.AccountSettings": "Account settings",
        "fullscreenMenu.HelpAndAccount.LogOut": "Log out",
        "fullscreenMenu.PublishStylesAndComponents": "Publish styles and components",
        "fullscreenMenu.Rename": "Rename",
        "fullscreenMenu.MoveToProject": "Move to project…",
        "fullscreenMenu.Delete": "Delete…",
        "fullscreenMenu.ZoomTo50": "Zoom to 50%",
        "fullscreenMenu.ZoomTo200": "Zoom to 200%",
        "fullscreenMenu.Disabled": "Disabled",
        "fullscreenMenu.Tooltip.MainMenu": "Main menu",
        "fullscreenMenu.Tooltip.MoveTools": "Move tools",
        "fullscreenMenu.Tooltip.SetToolDefault": "Move V",
        "fullscreenMenu.Tooltip.SetToolScale": "Scale K",
        "fullscreenMenu.Tooltip.RegionTools": "Region tools",
        "fullscreenMenu.Tooltip.SetToolFrame": "Frame F",
        "fullscreenMenu.Tooltip.SetToolSlice": "Slice S",
        "fullscreenMenu.Tooltip.ShapeTools": "Shape tools",
        "fullscreenMenu.Tooltip.SetToolRectangle": "Rectangle R",
        "fullscreenMenu.Tooltip.SetToolLine": "Line L",
        "fullscreenMenu.Tooltip.SetToolArrow": "Arrow Shift+L",
        "fullscreenMenu.Tooltip.SetToolEllipse": "Ellipse O",
        "fullscreenMenu.Tooltip.SetToolRegularPolygon": "Polygon",
        "fullscreenMenu.Tooltip.SetToolStar": "Star",
        "fullscreenMenu.Tooltip.DrawingTools": "Drawing tools",
        "fullscreenMenu.Tooltip.SetToolPen": "Pen P",
        "fullscreenMenu.Tooltip.SetToolPencil": "Pencil Shift+P",
        "fullscreenMenu.Tooltip.SetToolText": "Text T",
        "fullscreenMenu.Tooltip.SetToolHand": "Hand tool H",
        "fullscreenMenu.Tooltip.SetToolComments": "Add comment C",
        "fullscreenMenu.Tooltip.Present": "Present",
        "fullscreenMenu.Tooltip.CreateComponent": "Create component Ctrl+Alt+K",
        "fullscreenMenu.Tooltip.UseAsMask": "Use as mask Ctrl+Alt+M",
        "fullscreenMenu.Tooltip.BooleanGroups": "Boolean groups",
        "fullscreenMenu.Tooltip.UnionSelection": "Union selection",
        "fullscreenMenu.Tooltip.SubtractSelection": "Subtract selection",
        "fullscreenMenu.Tooltip.IntersectSelection": "Intersect selection",
        "fullscreenMenu.Tooltip.ExcludeSelection": "Exclude selection",
        "toolbarView.fileName.folderName.Drafts": "Drafts",
        "toolbarView.moveFlyout.flyout.toolDefault": "Move",
        "toolbarView.moveFlyout.flyout.toolScale": "Scale",
        "toolbarView.regionFlyout.flyout.toolFrame": "Frame",
        "toolbarView.regionFlyout.flyout.toolSlice": "Slice",
        "toolbarView.shapeFlyout.flyout.toolShapeRectangle": "Rectangle",
        "toolbarView.shapeFlyout.flyout.toolShapeLine": "Line",
        "toolbarView.shapeFlyout.flyout.toolShapeArrow": "Arrow",
        "toolbarView.shapeFlyout.flyout.toolShapeEllipse": "Ellipse",
        "toolbarView.shapeFlyout.flyout.toolShapePolygon": "Polygon",
        "toolbarView.shapeFlyout.flyout.toolShapeStar": "Star",
        "toolbarView.shapeFlyout.flyout.toolPlaceImage": "Place image...",
        "toolbarView.penFlyout.flyout.toolPen": "Pen",
        "toolbarView.penFlyout.flyout.toolPencil": "Pencil",
        "toolbarView.booleanFlyout.flyout.toolBooleanUnion": "Union selection",
        "toolbarView.booleanFlyout.flyout.toolBooleanSubtract": "Subtract selection",
        "toolbarView.booleanFlyout.flyout.toolBooleanIntersect": "Intersect selection",
        "toolbarView.booleanFlyout.flyout.toolBooleatoolBooleanXornUnion": "Exclude selection",
        "toolbarView.booleanFlyout.flyout.toolFlatten": "Flatten selection",
        "toolbarView.Share": "Share",
        "toolbarView.CursorChat": "Cursor chat",
        "toolbarView.Stamp": "Stamp",
        "toolbarView.Emote": "Emote",
        "toolbarView.Overflow.Emote": "Emote",
        "toolbarView.Overflow.Stamp": "Stamp",
        "toolbarView.Overflow.CursorChat": "Cursor chat",
        "toolbarView.Overflow.HighFive": "High five",
        "toolbarView.Overflow.Timer": "Timer",
        "toolbarView.Tooltip.Collaborate": "Collaborate",
        "toolbarView.Tooltip.ZoomOut": "Zoom out Ctrl+-",
        "toolbarView.Tooltip.ZoomIn": "Zoom in Ctrl+-",
        "toolbarView.Tooltip.ZoomOrViewOptions": "Zoom/view options",
        "delightfulToolbar.MoveTool": "Move tool V",
        "delightfulToolbar.HandTool": "Hand tool H",
        "delightfulToolbar.Marker": "Marker M",
        "delightfulToolbar.Highlighter": "Highlighter Shift+M",
        "delightfulToolbar.Eraser": "Eraser Shift+Backspace",
        "delightfulToolbar.Thin": "Thin",
        "delightfulToolbar.Thick": "Thick",
        "delightfulToolbar.Charcoal": "Charcoal",
        "delightfulToolbar.Red": "Red",
        "delightfulToolbar.Yellow": "Yellow",
        "delightfulToolbar.Green": "Green",
        "delightfulToolbar.Blue": "Blue",
        "delightfulToolbar.Violet": "Violet",
        "delightfulToolbar.Brown": "Brown",
        "delightfulToolbar.White": "White",
        "delightfulToolbar.Square": "Square R",
        "delightfulToolbar.Ellipse": "Ellipse O",
        "delightfulToolbar.RoundedRectangle": "Rounded rectangle",
        "delightfulToolbar.Diamond": "Diamond",
        "delightfulToolbar.TriangleUp": "Triangle",
        "delightfulToolbar.TriangleDown": "Triangle",
        "delightfulToolbar.ParallelogramRight": "Parallelogram",
        "delightfulToolbar.ParallelogramLeft": "Parallelogram",
        "delightfulToolbar.Cylinder": "Cylinder",
        "delightfulToolbar.HorizontalCylinder": "Horizontal cylinder",
        "delightfulToolbar.File": "File",
        "delightfulToolbar.Folder": "Folder",
        "delightfulToolbar.Options.Square": "Square",
        "delightfulToolbar.Options.Ellipse": "Ellipse",
        "delightfulToolbar.Options.RoundedRectangle": "Rounded rectangle",
        "delightfulToolbar.Options.Diamond": "Diamond",
        "delightfulToolbar.Options.Triangle": "Triangle",
        "delightfulToolbar.Options.DownwardPointingTriangle": "Downward-pointing triangle",
        "delightfulToolbar.Options.RightLeaningParallelogram": "Right-leaning parallelogram",
        "delightfulToolbar.Options.LeftLeaningParallelogram": "Left-leaning parallelogram",
        "delightfulToolbar.Options.Cylinder": "Cylinder",
        "delightfulToolbar.Options.HorizontalCylinder": "Horizontal cylinder",
        "delightfulToolbar.Options.File": "File",
        "delightfulToolbar.Options.Folder": "Folder",
        "delightfulToolbar.Sticky": "Sticky note S",
        "delightfulToolbar.Text": "Text T",
        "delightfulToolbar.Connector": "Connector X",
        "delightfulToolbar.Line": "Line L",
        "delightfulToolbar.Options.Connector": "Connector",
        "delightfulToolbar.Options.StraightLine": "Straight line",
        "delightfulToolbar.Stamp": "Stamp E",
        "delightfulToolbar.More": "Widgets,stickers,templates and more",
        "contextMenu.Copy": "Copy",
        "contextMenu.Paste": "Paste",
        "contextMenu.PasteHere": "Paste here",
        "contextMenu.CopyOrPasteAs": "Copy/Paste as",
        "contextMenu.CopyOrPasteAs.CopyLink": "Copy link",
        "contextMenu.SelectLayer": "Select layer",
        "contextMenu.MoveToPage": "Move to page",
        "contextMenu.Ungroup": "Ungroup",
        "contextMenu.Flatten": "Flatten",
        "contextMenu.ShowOrHide": "Show/Hide",
        "contextMenu.LockOrUnlock": "Lock/Unlock",
        "contextMenu.ShowOrHideComments": "Show/Hide comments",
        "pagesPanel.Sidebar.Tab": "Layers",
        "pagesPanel.Sidebar.AssetsTab": "Assets",
        "pagesPanel.Sidebar.Pages": "Pages",
        "pagesPanel.Sidebar.Pages.CopyLinkToPage": "Copy link to page",
        "pagesPanel.Sidebar.Pages.DeletePage": "Delete page",
        "pagesPanel.Sidebar.Pages.RenamePage": "Rename page",
        "pagesPanel.Sidebar.Pages.DuplicatePage": "Duplicate page",
        "pagesPanel.Sidebar.AddNewPage": "Add new page",
        "pagesPanel.Sidebar.Search": "Search",
        "pagesPanel.Sidebar.ShowAsList": "Show as list",
        "pagesPanel.Sidebar.ShowAsGrid": "Show as grid",
        "pagesPanel.Sidebar.TeamLibrary": "Team library",
        "pagesPanel.Sidebar.Components": "Components",
        "pagesPanel.Sidebar.Components.FirstInfoText": "To create a component, select a layer and click the \"Create component\" button in the toolbar.",
        "pagesPanel.Sidebar.Components.FirstInfoLink": "Learn more",
        "pagesPanel.Sidebar.Components.SecondInfoText": "Use libraries for quick access to components from other files.",
        "pagesPanel.Sidebar.Components.SecondInfoLink": "Explore libraries...",
        "propertiesPanel.TabsHeader.Design": "Design",
        "propertiesPanel.TabsHeader.Prototype": "Prototype",
        "propertiesPanel.TabsHeader.Inspect": "Inspect",
        "navbar.Community": "Community",
        "navbar.Search": "Search files, teams, or people",
        "navbar.Notifications": "Notifications",
        "navbar.InternalProfile": "Internal profile",
        "navbar.Settings": "Settings",
        "navbar.AddAccount": "Add account",
        "sidebar.Recents": "Recents",
        "sidebar.Drafts": "Drafts",
        "sidebar.ExploreCommunity": "Explore community",
        "sidebar.TeamProject": "Team project",
        "sidebar.CreateNewTeam": "Create new team",
        "fileBrowserView.RecentlyViewed": "Recently viewed",
        "fileBrowserView.Drafts": "Drafts",
        "fileBrowserView.Deleted": "Deleted",
        "fileBrowserView.NewDesignFile": "New design file",
        "fileBrowserView.NewDesignFile.Desc": "Design and prototype",
        "fileBrowserView.NewFigJamFile": "New FigJam file",
        "fileBrowserView.NewFigJamFile.Desc": "Whiteboard and diagram",
        "fileBrowserView.ImportFile": "Import file",
        "fileBrowserView.ImportFile.Desc": "Figma, Sketch, and image files",
        "fileBrowserView.Filter": "Filter:",
        "fileBrowserView.Filter.Select.AllFiles": "All files",
        "fileBrowserView.Filter.Select.DesignFiles": "Design files",
        "fileBrowserView.Filter.Select.FigJamFiles": "FigJam Files",
        "fileBrowserView.Filter.Select.Prototypes": "Prototypes",
        "fileBrowserView.Sort": "Sort:",
        "fileBrowserView.Sort.Select.SortBy": "Sort by",
        "fileBrowserView.Sort.Select.Alphabetical": "Alphabetical",
        "fileBrowserView.Sort.Select.DateCreated": "Date created",
        "fileBrowserView.Sort.Select.LastViewed": "Last viewed",
        "fileBrowserView.Sort.Select.LastModified": "Last modified",
        "fileBrowserView.Sort.Select.Order": "Order",
        "fileBrowserView.Sort.Select.OldestFirst": "Oldest first",
        "fileBrowserView.Sort.Select.NewestFirst": "Newest first",
        "fileBrowserView.ShowAsGrid": "Show as grid",
        "fileBrowserView.ShowAsList": "Show as list",
        "fileBrowserView.ContextMenu.ShowInProject": "Show in project",
        "fileBrowserView.ContextMenu.Open": "Open",
        "fileBrowserView.ContextMenu.OpenInNewTab": "Open in new tab",
        "fileBrowserView.ContextMenu.CopyLink": "Copy link",
        "fileBrowserView.ContextMenu.AddToYourFavorites": "Add to your favorites",
        "fileBrowserView.ContextMenu.Share": "Share",
        "fileBrowserView.ContextMenu.Duplicate": "Duplicate",
        "fileBrowserView.ContextMenu.Rename": "Rename",
        "fileBrowserView.ContextMenu.Delete": "Delete",
        "fileBrowserView.ContextMenu.RemoveFromRecent": "Remove from recent",
    };

    var ja = {
        "fullscreenMenu.BackToFiles": "プロジェクトに戻る",
        "fullscreenMenu.QuickActions": "Quick actions…",
        "fullscreenMenu.File": "ファイル",
        "fullscreenMenu.File.NewDesignFile": "新規作成",
        "fullscreenMenu.File.NewFigJamFile": "FigJam 新規作成",
        "fullscreenMenu.File.NewFromSketchFile": "Sketch ファイルを開く",
        "fullscreenMenu.File.PlaceImage": "画像を配置",
        "fullscreenMenu.File.ImportFromCSV": "Import from CSV…",
        "fullscreenMenu.File.SaveLocalCopy": "ローカルに保存",
        "fullscreenMenu.File.SaveToVersionHistory": "バージョン履歴を追加",
        "fullscreenMenu.File.ShowVersionHistory": "バージョン履歴を表示",
        "fullscreenMenu.File.Export": "書き出し",
        "fullscreenMenu.File.ExportFramesToPDF": "PDF で書き出し",
        "fullscreenMenu.File.ExportAs": "Export as…",
        "fullscreenMenu.File.ExportSelection": "Export selection…",
        "fullscreenMenu.Edit": "編集",
        "fullscreenMenu.Edit.Undo": "取り消し",
        "fullscreenMenu.Edit.Redo": "やり直し",
        "fullscreenMenu.Edit.CopyAs": "コピー",
        "fullscreenMenu.Edit.CopyAs.CopyAsText": "テキストとしてコピー",
        "fullscreenMenu.Edit.CopyAs.CopyAsCSS": "CSS としてコピー",
        "fullscreenMenu.Edit.CopyAs.CopyAsSVG": "SVG としてコピー",
        "fullscreenMenu.Edit.CopyAs.CopyAsPNG": "PNG としてコピー",
        "fullscreenMenu.Edit.PasteOverSelection": "選択したものの上にペースト",
        "fullscreenMenu.Edit.PasteToReplace": "置換してペースト",
        "fullscreenMenu.Edit.Duplicate": "複製",
        "fullscreenMenu.Edit.Delete": "削除",
        "fullscreenMenu.Edit.SetDefaultProperties": "プロパティのデフォルトに設定",
        "fullscreenMenu.Edit.CopyProperties": "プロパティをコピー",
        "fullscreenMenu.Edit.PasteProperties": "プロパティをペースト",
        "fullscreenMenu.Edit.PickColor": "色を選択",
        "fullscreenMenu.Edit.SelectAll": "すべてを選択",
        "fullscreenMenu.Edit.SelectNone": "選択解除",
        "fullscreenMenu.Edit.SelectInverse": "他を選択",
        "fullscreenMenu.Edit.SelectAllWithSameProperties": "共通のプロパティをすべて選択",
        "fullscreenMenu.Edit.SelectAllWithSameFill": "共通の塗りをすべて選択",
        "fullscreenMenu.Edit.SelectAllWithSameStroke": "共通の線をすべて選択",
        "fullscreenMenu.Edit.SelectAllWithSameEffect": "共通のエフェクトをすべて選択",
        "fullscreenMenu.Edit.SelectAllWithSameTextProperties": "共通のテキストプロパティをすべて選択",
        "fullscreenMenu.Edit.SelectAllWithSameFont": "共通のフォントを選択",
        "fullscreenMenu.Edit.SelectAllWithSameInstance": "共通のインスタンスを選択",
        "fullscreenMenu.View": "表示",
        "fullscreenMenu.View.PixelGrid": "ピクセルグリッドを表示",
        "fullscreenMenu.View.LayoutGrids": "レイアウトグリッドを表示",
        "fullscreenMenu.View.Rulers": "定規を表示",
        "fullscreenMenu.View.ShowSlices": "スライスを表示",
        "fullscreenMenu.View.Comments": "コメントを表示",
        "fullscreenMenu.View.Outlines": "アウトラインを表示",
        "fullscreenMenu.View.PixelPreview": "ピクセルでプレビュー",
        "fullscreenMenu.View.MaskOutlines": "マスクのアウトラインを表示",
        "fullscreenMenu.View.FrameOutlines": "フレームのアウトラインを表示",
        "fullscreenMenu.View.ShowDotGrid": "Show dot grid",
        "fullscreenMenu.View.ResourceUse": "リソース使用量を表示",
        "fullscreenMenu.View.ShowOrHideUI": "UI を表示/非表示",
        "fullscreenMenu.View.MultiplayerCursors": "共同作業者のカーソルを表示",
        "fullscreenMenu.View.Panels": "パネル",
        "fullscreenMenu.View.Panels.OpenLayersPanel": "レイヤーパネルを表示",
        "fullscreenMenu.View.Panels.OpenDesignPanel": "デザインパネルを表示",
        "fullscreenMenu.View.Panels.OpenPrototypePanel": "プロトタイプパネルを表示",
        "fullscreenMenu.View.Panels.OpenInspectPanel": "検査パネルを表示",
        "fullscreenMenu.View.Panels.ShowLeftSidebar": "サイドバーを表示",
        "fullscreenMenu.View.ZoomIn": "ズームイン",
        "fullscreenMenu.View.ZoomOut": "ズームアウト",
        "fullscreenMenu.View.ZoomTo100%": "100% にズーム",
        "fullscreenMenu.View.ZoomToFit": "画面に合わせてすべてをズーム",
        "fullscreenMenu.View.ZoomToSelection": "選択したものに合わせてズーム",
        "fullscreenMenu.View.PreviousPage": "前のページ",
        "fullscreenMenu.View.NextPage": "次のページ",
        "fullscreenMenu.View.ZoomToPreviousFrame": "前のフレームにズーム",
        "fullscreenMenu.View.ZoomToNextFrame": "次のフレームにズーム",
        "fullscreenMenu.View.FindPreviousFrame": "前のフレームに移動",
        "fullscreenMenu.View.FindNextFrame": "次のフレームに移動",
        "fullscreenMenu.Object": "オブジェクト",
        "fullscreenMenu.Object.GroupSelection": "グループ化",
        "fullscreenMenu.Object.CreateSection": "Create section",
        "fullscreenMenu.Object.FrameSelection": "フレーム化",
        "fullscreenMenu.Object.UngroupSelection": "グループ解除",
        "fullscreenMenu.Object.UseAsMask": "マスクを作成",
        "fullscreenMenu.Object.RestoreDefaultThumbnail": "デフォルトのサムネイルに戻す",
        "fullscreenMenu.Object.SetAsThumbnail": "ファイルのサムネイルに設定",
        "fullscreenMenu.Object.AddAutoLayout": "オートレイアウトを追加",
        "fullscreenMenu.Object.CreateComponent": "コンポーネントを作成",
        "fullscreenMenu.Object.ResetAllOverrides": "オーバーライドをリセット",
        "fullscreenMenu.Object.DetachInstance": "インスタンスを解除",
        "fullscreenMenu.Object.MainComponent": "メインコンポーネント",
        "fullscreenMenu.Object.MainComponent.GoToMainComponent": "メインコンポーネントへ移動",
        "fullscreenMenu.Object.MainComponent.PushOverridesToMainComponent": "オーバーライドをメインに反映",
        "fullscreenMenu.Object.MainComponent.RestoreMainComponent": "メインコンポーネントを復元",
        "fullscreenMenu.Object.BringToFront": "最前面へ",
        "fullscreenMenu.Object.BringForward": "前面へ",
        "fullscreenMenu.Object.SendBackward": "背面へ",
        "fullscreenMenu.Object.SendToBack": "最背面へ",
        "fullscreenMenu.Object.flipHorizontal": "水平方向に反転",
        "fullscreenMenu.Object.flipVertical": "垂直方向に反転",
        "fullscreenMenu.Object.Rotate180": "180°回転",
        "fullscreenMenu.Object.Rotate90Left": "左に90°回転",
        "fullscreenMenu.Object.Rotate90Right": "右に90°回転",
        "fullscreenMenu.Object.FlattenSelection": "複合パスに拡張",
        "fullscreenMenu.Object.OutlineStroke": "パスのアウトライン",
        "fullscreenMenu.Object.BooleanGroups": "複合シェイプを作成",
        "fullscreenMenu.Object.BooleanGroups.UnionSelection": "合体",
        "fullscreenMenu.Object.BooleanGroups.SubtractSelection": "前面オブジェクトで型抜き",
        "fullscreenMenu.Object.BooleanGroups.IntersectSelection": "交差",
        "fullscreenMenu.Object.BooleanGroups.ExcludeSelection": "中マド",
        "fullscreenMenu.Object.RasterizeSelection": "ラスタライズ",
        "fullscreenMenu.Object.ShowOrHideSelection": "選択したものを表示/非表示",
        "fullscreenMenu.Object.LockOrUnlockSelection": "選択したものをロック/ロック解除",
        "fullscreenMenu.Object.HideOtherLayers": "他のレイヤーを隠す",
        "fullscreenMenu.Object.CollapseLayers": "レイヤーを閉じる",
        "fullscreenMenu.Object.RemoveFill": "塗りを削除",
        "fullscreenMenu.Object.RemoveStroke": "線を削除",
        "fullscreenMenu.Object.SwapFillAndStroke": "塗りと線を入れ替え",
        "fullscreenMenu.Vector": "ベクター",
        "fullscreenMenu.Vector.JoinSelection": "アンカーポイントを連結",
        "fullscreenMenu.Vector.SmoothJoinSelection": "アンカーポイントをスムーズに連結",
        "fullscreenMenu.Vector.DeleteAndHealSelection": "アンカーポイントを削除",
        "fullscreenMenu.Text": "テキスト",
        "fullscreenMenu.Text.Bold": "太字",
        "fullscreenMenu.Text.Italic": "斜体",
        "fullscreenMenu.Text.Underline": "下線",
        "fullscreenMenu.Text.Strikethrough": "打ち消し線",
        "fullscreenMenu.Text.CreateLink": "リンクを生成",
        "fullscreenMenu.Text.BulletedList": "箇条書き",
        "fullscreenMenu.Text.NumberedList": "番号付リスト",
        "fullscreenMenu.Text.Alignment": "文字揃え",
        "fullscreenMenu.Text.Alignment.TextAlignLeft": "左揃え",
        "fullscreenMenu.Text.Alignment.TextAlignCenter": "中央揃え",
        "fullscreenMenu.Text.Alignment.TextAlignRight": "右揃え",
        "fullscreenMenu.Text.Alignment.TextAlignJustified": "均等揃え",
        "fullscreenMenu.Text.Alignment.TextAlignTop": "ボックスの上揃え",
        "fullscreenMenu.Text.Alignment.TextAlignMiddle": "ボックスの垂直方向中央揃え",
        "fullscreenMenu.Text.Alignment.TextAlignBottom": "ボックスの下揃え",
        "fullscreenMenu.Text.Adjust": "調整",
        "fullscreenMenu.Text.Adjust.IncreaseIndentation": "インデントを増やす",
        "fullscreenMenu.Text.Adjust.DecreaseIndentation": "インデントを減らす",
        "fullscreenMenu.Text.Adjust.IncreaseFontSize": "フォントサイズを大きく",
        "fullscreenMenu.Text.Adjust.DecreaseFontSize": "フォントサイズを小さく",
        "fullscreenMenu.Text.Adjust.IncreaseFontWeight": "フォントウェイトを大きく",
        "fullscreenMenu.Text.Adjust.DecreaseFontWeight": "フォントウェイトを小さく",
        "fullscreenMenu.Text.Adjust.IncreaseLineHeight": "行送りを増やす",
        "fullscreenMenu.Text.Adjust.DecreaseLineHeight": "行送りを減らす",
        "fullscreenMenu.Text.Adjust.IncreaseLetterSpacing": "文字の間隔を広げる",
        "fullscreenMenu.Text.Adjust.DecreaseLetterSpacing": "文字の間隔を詰める",
        "fullscreenMenu.Text.Case": "大文字小文字",
        "fullscreenMenu.Text.Case.OriginalCase": "大文字小文字の変換なし",
        "fullscreenMenu.Text.Case.Uppercase": "すべて大文字",
        "fullscreenMenu.Text.Case.Lowercase": "すべて小文字",
        "fullscreenMenu.Arrange": "整列",
        "fullscreenMenu.Arrange.RoundToPixel": "ピクセルに合わせて配置",
        "fullscreenMenu.Arrange.AlignLeft": "水平方向左に整列",
        "fullscreenMenu.Arrange.AlignHorizontalCenters": "水平方向中央に整列",
        "fullscreenMenu.Arrange.AlignRight": "水平方向右に整列",
        "fullscreenMenu.Arrange.AlignTop": "垂直方向上に整列",
        "fullscreenMenu.Arrange.AlignVerticalCenters": "垂直方向中央に整列",
        "fullscreenMenu.Arrange.AlignBottom": "垂直方向下に整列",
        "fullscreenMenu.Arrange.TidyUp": "選択状態に応じて自動で整列",
        "fullscreenMenu.Arrange.PackHorizontal": "水平方向へ間隔なしで整列",
        "fullscreenMenu.Arrange.PackVertical": "垂直方向へ間隔なしで整列",
        "fullscreenMenu.Arrange.DistributeHorizontalSpacing": "水平方向へ等間隔に分布",
        "fullscreenMenu.Arrange.DistributeVerticalSpacing": "垂直方向へ等間隔に分布",
        "fullscreenMenu.Arrange.DistributeLeft": "左を基準に、水平方向へ分布",
        "fullscreenMenu.Arrange.DistributeHorizontalCenters": "中心を基準に、水平方向へ分布",
        "fullscreenMenu.Arrange.DistributeRight": "右を基準に、水平方向へ分布",
        "fullscreenMenu.Arrange.DistributeTop": "上を基準に、垂直方向へ分布",
        "fullscreenMenu.Arrange.DistributeVerticalCenters": "中心を基準に、垂直方向へ分布",
        "fullscreenMenu.Arrange.DistributeBottom": "下を基準に、垂直方向へ分布",
        "fullscreenMenu.Plugins": "プラグイン",
        "fullscreenMenu.Plugins.RunLastPlugin": "最後に使ったプラグインを実行",
        "fullscreenMenu.Plugins.ManagePlugins": "プラグインを管理",
        "fullscreenMenu.Plugins.BrowsePluginsInCommunity": "プラグインを探す",
        "fullscreenMenu.Plugins.BrowsePlugins": "Browse plugins",
        "fullscreenMenu.Widgets": "Widgets",
        "fullscreenMenu.Widgets.BrowseWidgets": "Browse widgets",
        "fullscreenMenu.Widgets.SelectAllWidgets": "Select all widgets",
        "fullscreenMenu.Integrations": "連携",
        "fullscreenMenu.Integrations.Dribbble": "Dribbble",
        "fullscreenMenu.Preferences": "環境設定",
        "fullscreenMenu.Preferences.SnapToGeometry": "ジオメトリにスナップ",
        "fullscreenMenu.Preferences.SnapToObjects": "オブジェクトにスナップ",
        "fullscreenMenu.Preferences.SnapToDotGrid": "Snap to dot grid",
        "fullscreenMenu.Preferences.SnapToPixelGrid": "ピクセルグリッドにスナップ",
        "fullscreenMenu.Preferences.KeepToolSelectedAfterUse": "使用したツールを保持する",
        "fullscreenMenu.Preferences.HighlightLayersOnHover": "ホバーでレイヤーをハイライト表示",
        "fullscreenMenu.Preferences.RenameDuplicatedLayers": "複製したレイヤーをリネーム",
        "fullscreenMenu.Preferences.ShowDimensionsOnObjects": "オブジェクトのサイズを表示",
        "fullscreenMenu.Preferences.HideCanvasUIDuringChanges": "変形中にキャンバス表示を非表示",
        "fullscreenMenu.Preferences.KeyboardZoomsIntoSelection": "選択対象にキーボードズーム",
        "fullscreenMenu.Preferences.SubstituteSmartQuotes": "スマートクォート（ “ ” ）に変換入力",
        "fullscreenMenu.Preferences.ShowGoogleFonts": "Googleフォントを表示",
        "fullscreenMenu.Preferences.FlipObjectsWhileResizing": "サイズ変更中にオブジェクトを反転",
        "fullscreenMenu.Preferences.InvertZoomDirection": "ホイールでのズームの方向を反転",
        "fullscreenMenu.Preferences.UseNumberKeysForOpacity": "テンキーで不透明度を変更",
        "fullscreenMenu.Preferences.ShakeCursorForHighFive": "Shake cursor for high five",
        "fullscreenMenu.Preferences.OpenLinksInDesktopApp": "Open links in desktop app",
        "fullscreenMenu.Preferences.NudgeAmount": "テンキー操作の値",
        "fullscreenMenu.Preferences.ShowTemplatesForNewFiles": "Show templates for new files",
        "fullscreenMenu.Libraries": "ライブラリ",
        "fullscreenMenu.GetDesktopApp": "Get desktop app",
        "fullscreenMenu.OpenInDesktopApp": "Open in desktop app",
        "fullscreenMenu.HelpAndAccount": "ヘルプとアカウント",
        "fullscreenMenu.HelpAndAccount.HelpPage": "ヘルプページ",
        "fullscreenMenu.HelpAndAccount.KeyboardShortcuts": "キーボードショートカット",
        "fullscreenMenu.HelpAndAccount.SupportForum": "サポートフォーラム",
        "fullscreenMenu.HelpAndAccount.VideoTutorials": "ビデオチュートリアル",
        "fullscreenMenu.HelpAndAccount.ReleaseNotes": "リリースノート",
        "fullscreenMenu.HelpAndAccount.OpenFontSettings": "フォント設定を開く",
        "fullscreenMenu.HelpAndAccount.LegalSummary": "利用規約",
        "fullscreenMenu.HelpAndAccount.AccountSettings": "アカウント設定",
        "fullscreenMenu.HelpAndAccount.LogOut": "ログアウト",
        "fullscreenMenu.PublishStylesAndComponents": "スタイルとコンポーネントを公開",
        "fullscreenMenu.Rename": "名前を変更",
        "fullscreenMenu.MoveToProject": "プロジェクトへ移動",
        "fullscreenMenu.Delete": "削除",
        "fullscreenMenu.ZoomTo50": "50% にズーム",
        "fullscreenMenu.ZoomTo200": "200% にズーム",
        "fullscreenMenu.Disabled": "無効",
        "fullscreenMenu.Tooltip.MainMenu": "Main menu",
        "fullscreenMenu.Tooltip.MoveTools": "移動ツール",
        "fullscreenMenu.Tooltip.SetToolDefault": "移動 V",
        "fullscreenMenu.Tooltip.SetToolScale": "拡大・縮小 K",
        "fullscreenMenu.Tooltip.RegionTools": "リージョンツール",
        "fullscreenMenu.Tooltip.SetToolFrame": "フレーム F",
        "fullscreenMenu.Tooltip.SetToolSlice": "スライス S",
        "fullscreenMenu.Tooltip.ShapeTools": "シェイプツール",
        "fullscreenMenu.Tooltip.SetToolRectangle": "長方形 R",
        "fullscreenMenu.Tooltip.SetToolLine": "直線 L",
        "fullscreenMenu.Tooltip.SetToolArrow": "矢印 Shift+L",
        "fullscreenMenu.Tooltip.SetToolEllipse": "楕円 O",
        "fullscreenMenu.Tooltip.SetToolRegularPolygon": "多角形",
        "fullscreenMenu.Tooltip.SetToolStar": "スター",
        "fullscreenMenu.Tooltip.DrawingTools": "ドローツール",
        "fullscreenMenu.Tooltip.SetToolPen": "ペン P",
        "fullscreenMenu.Tooltip.SetToolPencil": "鉛筆 Shift+P",
        "fullscreenMenu.Tooltip.SetToolText": "テキスト T",
        "fullscreenMenu.Tooltip.SetToolHand": "手のひらツール H",
        "fullscreenMenu.Tooltip.SetToolComments": "コメントの追加 C",
        "fullscreenMenu.Tooltip.Present": "プレゼンテーション",
        "fullscreenMenu.Tooltip.CreateComponent": "Create component Ctrl+Alt+K",
        "fullscreenMenu.Tooltip.UseAsMask": "Use as mask Ctrl+Alt+M",
        "fullscreenMenu.Tooltip.BooleanGroups": "Boolean groups",
        "fullscreenMenu.Tooltip.UnionSelection": "Union selection",
        "fullscreenMenu.Tooltip.SubtractSelection": "Subtract selection",
        "fullscreenMenu.Tooltip.IntersectSelection": "Intersect selection",
        "fullscreenMenu.Tooltip.ExcludeSelection": "Exclude selection",
        "toolbarView.fileName.folderName.Drafts": "Drafts",
        "toolbarView.moveFlyout.flyout.toolDefault": "移動",
        "toolbarView.moveFlyout.flyout.toolScale": "拡大・縮小",
        "toolbarView.regionFlyout.flyout.toolFrame": "フレーム'",
        "toolbarView.regionFlyout.flyout.toolSlice": "スライス",
        "toolbarView.shapeFlyout.flyout.toolShapeRectangle": "長方形",
        "toolbarView.shapeFlyout.flyout.toolShapeLine": "直線",
        "toolbarView.shapeFlyout.flyout.toolShapeArrow": "矢印",
        "toolbarView.shapeFlyout.flyout.toolShapeEllipse": "楕円",
        "toolbarView.shapeFlyout.flyout.toolShapePolygon": "多角形",
        "toolbarView.shapeFlyout.flyout.toolShapeStar": "スター",
        "toolbarView.shapeFlyout.flyout.toolPlaceImage": "画像を配置",
        "toolbarView.penFlyout.flyout.toolPen": "ペン",
        "toolbarView.penFlyout.flyout.toolPencil": "鉛筆",
        "toolbarView.booleanFlyout.flyout.toolBooleanUnion": "Union selection",
        "toolbarView.booleanFlyout.flyout.toolBooleanSubtract": "Subtract selection",
        "toolbarView.booleanFlyout.flyout.toolBooleanIntersect": "Intersect selection",
        "toolbarView.booleanFlyout.flyout.toolBooleatoolBooleanXornUnion": "Exclude selection",
        "toolbarView.booleanFlyout.flyout.toolFlatten": "Flatten selection",
        "toolbarView.Share": "共有",
        "toolbarView.CursorChat": "Cursor chat",
        "toolbarView.Stamp": "Stamp",
        "toolbarView.Emote": "Emote",
        "toolbarView.Overflow.Emote": "Emote",
        "toolbarView.Overflow.Stamp": "Stamp",
        "toolbarView.Overflow.CursorChat": "Cursor chat",
        "toolbarView.Overflow.HighFive": "High five",
        "toolbarView.Overflow.Timer": "Timer",
        "toolbarView.Tooltip.Collaborate": "Collaborate",
        "toolbarView.Tooltip.ZoomOut": "Zoom out Ctrl+-",
        "toolbarView.Tooltip.ZoomIn": "Zoom in Ctrl+-",
        "toolbarView.Tooltip.ZoomOrViewOptions": "Zoom/view options",
        "delightfulToolbar.MoveTool": "移動ツール V",
        "delightfulToolbar.HandTool": "手のひらツール H",
        "delightfulToolbar.Marker": "Marker M",
        "delightfulToolbar.Highlighter": "Highlighter Shift+M",
        "delightfulToolbar.Eraser": "Eraser Shift+Backspace",
        "delightfulToolbar.Thin": "Thin",
        "delightfulToolbar.Thick": "Thick",
        "delightfulToolbar.Charcoal": "Charcoal",
        "delightfulToolbar.Red": "Red",
        "delightfulToolbar.Yellow": "Yellow",
        "delightfulToolbar.Green": "Green",
        "delightfulToolbar.Blue": "Blue",
        "delightfulToolbar.Violet": "Violet",
        "delightfulToolbar.Brown": "Brown",
        "delightfulToolbar.White": "White",
        "delightfulToolbar.Square": "Square R",
        "delightfulToolbar.Ellipse": "Ellipse O",
        "delightfulToolbar.RoundedRectangle": "Rounded rectangle",
        "delightfulToolbar.Diamond": "Diamond",
        "delightfulToolbar.TriangleUp": "Triangle",
        "delightfulToolbar.TriangleDown": "Triangle",
        "delightfulToolbar.ParallelogramRight": "Parallelogram",
        "delightfulToolbar.ParallelogramLeft": "Parallelogram",
        "delightfulToolbar.Cylinder": "Cylinder",
        "delightfulToolbar.HorizontalCylinder": "Horizontal cylinder",
        "delightfulToolbar.File": "File",
        "delightfulToolbar.Folder": "Folder",
        "delightfulToolbar.Options.Square": "Square",
        "delightfulToolbar.Options.Ellipse": "Ellipse",
        "delightfulToolbar.Options.RoundedRectangle": "Rounded rectangle",
        "delightfulToolbar.Options.Diamond": "Diamond",
        "delightfulToolbar.Options.Triangle": "Triangle",
        "delightfulToolbar.Options.DownwardPointingTriangle": "Downward-pointing triangle",
        "delightfulToolbar.Options.RightLeaningParallelogram": "Right-leaning parallelogram",
        "delightfulToolbar.Options.LeftLeaningParallelogram": "Left-leaning parallelogram",
        "delightfulToolbar.Options.Cylinder": "Cylinder",
        "delightfulToolbar.Options.HorizontalCylinder": "Horizontal cylinder",
        "delightfulToolbar.Options.File": "File",
        "delightfulToolbar.Options.Folder": "Folder",
        "delightfulToolbar.Sticky": "Sticky note S",
        "delightfulToolbar.Text": "Text T",
        "delightfulToolbar.Connector": "Connector X",
        "delightfulToolbar.Line": "Line L",
        "delightfulToolbar.Options.Connector": "Connector",
        "delightfulToolbar.Options.StraightLine": "Straight line",
        "delightfulToolbar.Stamp": "Stamp E",
        "delightfulToolbar.More": "Widgets,stickers,templates and more",
        "contextMenu.Copy": "コピー",
        "contextMenu.Paste": "ペースト",
        "contextMenu.PasteHere": "Paste here",
        "contextMenu.CopyOrPasteAs": "Copy/Paste as",
        "contextMenu.CopyOrPasteAs.CopyLink": "リンクをコピー",
        "contextMenu.SelectLayer": "レイヤー選択",
        "contextMenu.MoveToPage": "ページへ移動",
        "contextMenu.Ungroup": "グループ解除",
        "contextMenu.Flatten": "複合パスに拡張",
        "contextMenu.ShowOrHide": "表示/非表示",
        "contextMenu.LockOrUnlock": "ロック/ロック解除",
        "contextMenu.ShowOrHideComments": "Show/Hide comments",
        "pagesPanel.Sidebar.Tab": "Layers",
        "pagesPanel.Sidebar.AssetsTab": "Assets",
        "pagesPanel.Sidebar.Pages": "Pages",
        "pagesPanel.Sidebar.Pages.CopyLinkToPage": "ページへのリンクをコピー",
        "pagesPanel.Sidebar.Pages.DeletePage": "ページを削除",
        "pagesPanel.Sidebar.Pages.RenamePage": "ページ名を変更",
        "pagesPanel.Sidebar.Pages.DuplicatePage": "ページを複製",
        "pagesPanel.Sidebar.AddNewPage": "Add new page",
        "pagesPanel.Sidebar.Search": "検索",
        "pagesPanel.Sidebar.ShowAsList": "Show as list",
        "pagesPanel.Sidebar.ShowAsGrid": "Show as grid",
        "pagesPanel.Sidebar.TeamLibrary": "チームライブラリ",
        "pagesPanel.Sidebar.Components": "コンポーネント",
        "pagesPanel.Sidebar.Components.FirstInfoText": "To create a component, select a layer and click the \"Create component\" button in the toolbar.",
        "pagesPanel.Sidebar.Components.FirstInfoLink": "Learn more",
        "pagesPanel.Sidebar.Components.SecondInfoText": "Use libraries for quick access to components from other files.",
        "pagesPanel.Sidebar.Components.SecondInfoLink": "Explore libraries...",
        "propertiesPanel.TabsHeader.Design": "デザイン",
        "propertiesPanel.TabsHeader.Prototype": "プロトタイプ",
        "propertiesPanel.TabsHeader.Inspect": "検査",
        "navbar.Community": "Community",
        "navbar.Search": "Search files, teams, or people",
        "navbar.Notifications": "Notifications",
        "navbar.InternalProfile": "Internal profile",
        "navbar.Settings": "Settings",
        "navbar.AddAccount": "Add account",
        "sidebar.Recents": "Recents",
        "sidebar.Drafts": "Drafts",
        "sidebar.ExploreCommunity": "Explore community",
        "sidebar.TeamProject": "Team project",
        "sidebar.CreateNewTeam": "Create new team",
        "fileBrowserView.RecentlyViewed": "Recently viewed",
        "fileBrowserView.Drafts": "Drafts",
        "fileBrowserView.Deleted": "Deleted",
        "fileBrowserView.NewDesignFile": "新規作成",
        "fileBrowserView.NewDesignFile.Desc": "Design and prototype",
        "fileBrowserView.NewFigJamFile": "FigJam 新規作成",
        "fileBrowserView.NewFigJamFile.Desc": "Whiteboard and diagram",
        "fileBrowserView.ImportFile": "Import file",
        "fileBrowserView.ImportFile.Desc": "Figma, Sketch, and image files",
        "fileBrowserView.Filter": "Filter:",
        "fileBrowserView.Filter.Select.AllFiles": "All files",
        "fileBrowserView.Filter.Select.DesignFiles": "Design files",
        "fileBrowserView.Filter.Select.FigJamFiles": "FigJam Files",
        "fileBrowserView.Filter.Select.Prototypes": "Prototypes",
        "fileBrowserView.Sort": "Sort:",
        "fileBrowserView.Sort.Select.SortBy": "Sort by",
        "fileBrowserView.Sort.Select.Alphabetical": "Alphabetical",
        "fileBrowserView.Sort.Select.DateCreated": "Date created",
        "fileBrowserView.Sort.Select.LastViewed": "Last viewed",
        "fileBrowserView.Sort.Select.LastModified": "Last modified",
        "fileBrowserView.Sort.Select.Order": "Order",
        "fileBrowserView.Sort.Select.OldestFirst": "Oldest first",
        "fileBrowserView.Sort.Select.NewestFirst": "Newest first",
        "fileBrowserView.ShowAsGrid": "Show as grid",
        "fileBrowserView.ShowAsList": "Show as list",
        "fileBrowserView.ContextMenu.ShowInProject": "Show in project",
        "fileBrowserView.ContextMenu.Open": "Open",
        "fileBrowserView.ContextMenu.OpenInNewTab": "Open in new tab",
        "fileBrowserView.ContextMenu.CopyLink": "Copy link",
        "fileBrowserView.ContextMenu.AddToYourFavorites": "Add to your favorites",
        "fileBrowserView.ContextMenu.Share": "Share",
        "fileBrowserView.ContextMenu.Duplicate": "Duplicate",
        "fileBrowserView.ContextMenu.Rename": "Rename",
        "fileBrowserView.ContextMenu.Delete": "Delete",
        "fileBrowserView.ContextMenu.RemoveFromRecent": "Remove from recent",
    };

    const languageDict = {
        en: {
            name: "English",
            dict: en
        },
        zhCn: {
            name: "简体中文",
            dict: zhCn
        },
        ja: {
            name: "日本語",
            dict: ja
        }
    };

    const generateLangInfoList = (langDict) => {
        let list = [];
        for (const key in langDict) {
            if (Object.prototype.hasOwnProperty.call(langDict, key)) {
                const val = langDict[key];
                list.push({
                    ID: key,
                    name: val.name,
                    dict: val.dict,
                });
            }
        }
        return list;
    };
    const languageContentTranslate = function (elementName, lang) {
        const langDict = languageDict;
        return langDict[lang] && langDict[lang]["dict"] && langDict[lang]["dict"][elementName] ? langDict[lang]["dict"][elementName] : "";
    };
    const langInfoList = generateLangInfoList(languageDict);
    const languageConverter = (elements, lang) => {
        const matchElement = getTargetElement(elements);
        for (const elementName in matchElement) {
            if (Object.prototype.hasOwnProperty.call(matchElement, elementName)) {
                const target = matchElement[elementName];
                if (target) {
                    const langCon = languageContentTranslate(elementName, lang);
                    let trackStatus = true;
                    if (target.type == "Attr") {
                        for (let i = 0; i < target.attrList.length; i++) {
                            const attrNode = target.attrList[i];
                            if (attrNode.Key == "no-track") {
                                trackStatus = false;
                                continue;
                            }
                            if (attrNode.Key == "text-content") {
                                target.node.textContent = langCon;
                                continue;
                            }
                            if (attrNode.Value == "" && target.node.getAttribute(attrNode.Key) != langCon) {
                                target.node.setAttribute(attrNode.Key, langCon);
                            }
                            if (attrNode.Value != "" && target.node.getAttribute(attrNode.Key) != attrNode.Value) {
                                target.node.setAttribute(attrNode.Key, attrNode.Value);
                            }
                        }
                    }
                    if (target.type == "Text" && target.node.textContent != langCon) {
                        target.node.textContent = langCon;
                    }
                    if (trackStatus && target.node && target.node.setAttribute) {
                        target.node.setAttribute("figma-i18n-id", elementName);
                    }
                }
            }
        }
    };

    var translator = /*#__PURE__*/Object.freeze({
        __proto__: null,
        langInfoList: langInfoList,
        languageConverter: languageConverter
    });

    const langStore = {
        _key: "figma-i18n-lang",
        _status: "",
        get status() {
            if (window && window.localStorage && this._status == "") {
                return localStorage.getItem(this._key);
            }
            return this._status;
        },
        set status(val) {
            if (window && window.localStorage) {
                localStorage.setItem(this._key, val);
            }
            this._status = val;
        }
    };

    var RunMode;
    (function (RunMode) {
        RunMode[RunMode["Dev"] = 0] = "Dev";
        RunMode[RunMode["Prod"] = 1] = "Prod";
    })(RunMode || (RunMode = {}));
    var MenuTheme;
    (function (MenuTheme) {
        MenuTheme["Dark"] = "Dark";
        MenuTheme["Light"] = "Light";
    })(MenuTheme || (MenuTheme = {}));

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z = ".fi_lang-menu.svelte-1n0l2p3 .fi_lang_toolbar.svelte-1n0l2p3{cursor:default;display:flex;height:48px;position:relative;width:53px}.fi_lang-menu.svelte-1n0l2p3 .fi_lang_toolbar .fi_svg-container.svelte-1n0l2p3{align-items:center;display:flex;height:100%;justify-content:flex-end;width:30px}.fi_lang-menu.svelte-1n0l2p3 .fi_lang_toolbar .fi_chevron--chevronContainer.svelte-1n0l2p3{display:flex;flex:0 0 auto;width:18px}.fi_lang-menu.svelte-1n0l2p3 .fi_lang_toolbar .fi_chevron--chevronContainer .fi_svg-container.svelte-1n0l2p3{justify-content:center;transition:padding-top .15s}.fi_lang-menu.svelte-1n0l2p3 .fi_lang_toolbar:hover .fi_chevron--chevronContainer .fi_svg-container.svelte-1n0l2p3,.fi_lang-menu.svelte-1n0l2p3 .selected .fi_chevron--chevronContainer .fi_svg-container.svelte-1n0l2p3{padding-top:3px}.fi_lang-menu.svelte-1n0l2p3 .fi_lang-container.svelte-1n0l2p3{padding:10px 0;position:absolute;right:2px;top:53px;user-select:none;width:100px}.fi_lang-menu.svelte-1n0l2p3 .fi_lang-container.svelte-1n0l2p3:before{border:5px solid transparent;content:\"\";height:0;position:absolute;right:6px;top:-10px;width:0}.fi_lang-menu.svelte-1n0l2p3 .fi_lang-container .fi_lang-container-list.svelte-1n0l2p3{display:flex;height:24px;line-height:24px;width:100%}.fi_lang-menu.svelte-1n0l2p3 .fi_lang-container .fi_lang-container-list .fi_container-icon.svelte-1n0l2p3{align-items:center;display:flex;font-weight:700;height:100%;justify-content:center;width:32px}.fi_lang-menu.svelte-1n0l2p3 .fi_lang-container .fi_lang-container-list .fi_container-text.svelte-1n0l2p3{flex:1;font-size:12px;text-align:left}.fi_theme-dark.svelte-1n0l2p3.svelte-1n0l2p3{fill:#fff}.fi_theme-dark.svelte-1n0l2p3 .fi_lang_toolbar.svelte-1n0l2p3:hover{background:#000}.fi_theme-dark.svelte-1n0l2p3 .selected.svelte-1n0l2p3{background:#18a0fb!important}.fi_theme-dark.svelte-1n0l2p3 .fi_lang-container.svelte-1n0l2p3{background:#2c2c2c}.fi_theme-dark.svelte-1n0l2p3 .fi_lang-container.svelte-1n0l2p3:before{border-bottom:5px solid #2c2c2c}.fi_theme-dark.svelte-1n0l2p3 .fi_lang-container .fi_lang-container-list.svelte-1n0l2p3:hover{background:#18a0fb}.fi_theme-dark.svelte-1n0l2p3 .fi_lang-container .fi_lang-container-list .fi_container-text.svelte-1n0l2p3{color:#fff}.fi_theme-light.svelte-1n0l2p3.svelte-1n0l2p3{fill:rgba(0,0,0,.8)}.fi_theme-light.svelte-1n0l2p3 .fi_lang_toolbar.svelte-1n0l2p3:hover{background:#f0f0f0}.fi_theme-light.svelte-1n0l2p3 .selected.svelte-1n0l2p3{fill:#fff;background:#9747ff!important}.fi_theme-light.svelte-1n0l2p3 .fi_lang-container.svelte-1n0l2p3{background:#fff;box-shadow:0 0 10px rgba(0,0,0,.3)}.fi_theme-light.svelte-1n0l2p3 .fi_lang-container.svelte-1n0l2p3:before{border-bottom:5px solid #2c2c2c}.fi_theme-light.svelte-1n0l2p3 .fi_lang-container .fi_lang-container-list.svelte-1n0l2p3:hover{fill:#fff;background:#9747ff}.fi_theme-light.svelte-1n0l2p3 .fi_lang-container .fi_lang-container-list:hover .fi_container-text.svelte-1n0l2p3{color:#fff}.fi_theme-light.svelte-1n0l2p3 .fi_lang-container .fi_lang-container-list .fi_container-text.svelte-1n0l2p3{color:rgba(0,0,0,.8)}";
    styleInject(css_248z);

    /* src/ui/Menu.svelte generated by Svelte v3.48.0 */

    const { console: console_1$1 } = globals;
    const file = "src/ui/Menu.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (81:2) {#if openStatus}
    function create_if_block(ctx) {
    	let div;
    	let each_value = /*langInfoList*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "fi_lang-container svelte-1n0l2p3");
    			add_location(div, file, 81, 3, 2658);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*switchLanguage, langInfoList, selectLangID*/ 44) {
    				each_value = /*langInfoList*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(81:2) {#if openStatus}",
    		ctx
    	});

    	return block;
    }

    // (90:7) {#if selectLangID == langInfo.ID}
    function create_if_block_1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M441.6 812.8c-19.2 0-32-6.4-44.8-19.2L70.4 467.2c-25.6-25.6-25.6-64 0-89.6 25.6-25.6 64-25.6 89.6 0l281.6 281.6 441.6-428.8c25.6-25.6 64-25.6 89.6 0 25.6 25.6 25.6 64 0 89.6l-486.4 473.6C473.6 806.4 460.8 812.8 441.6 812.8z");
    			attr_dev(path, "p-id", "2040");
    			add_location(path, file, 99, 9, 3151);
    			attr_dev(svg, "class", "icon");
    			attr_dev(svg, "viewBox", "0 0 1024 1024");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "p-id", "2047");
    			attr_dev(svg, "width", "10");
    			attr_dev(svg, "height", "10");
    			add_location(svg, file, 90, 8, 2943);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(90:7) {#if selectLangID == langInfo.ID}",
    		ctx
    	});

    	return block;
    }

    // (83:4) {#each langInfoList as langInfo}
    function create_each_block(ctx) {
    	let div1;
    	let span;
    	let t0;
    	let div0;
    	let t1_value = /*langInfo*/ ctx[12].name + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block = /*selectLangID*/ ctx[2] == /*langInfo*/ ctx[12].ID && create_if_block_1(ctx);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[7](/*langInfo*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span = element("span");
    			if (if_block) if_block.c();
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(span, "class", "fi_container-icon svelte-1n0l2p3");
    			add_location(span, file, 88, 6, 2861);
    			attr_dev(div0, "class", "fi_container-text svelte-1n0l2p3");
    			add_location(div0, file, 106, 6, 3477);
    			attr_dev(div1, "class", "fi_lang-container-list svelte-1n0l2p3");
    			add_location(div1, file, 83, 5, 2732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span);
    			if (if_block) if_block.m(span, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div1, t2);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", stop_propagation(click_handler_1), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*selectLangID*/ ctx[2] == /*langInfo*/ ctx[12].ID) {
    				if (if_block) ; else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(83:4) {#each langInfoList as langInfo}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div2;
    	let span2;
    	let div1;
    	let span0;
    	let svg0;
    	let path0;
    	let t0;
    	let div0;
    	let span1;
    	let svg1;
    	let path1;
    	let t1;
    	let span2_class_value;
    	let mounted;
    	let dispose;
    	let if_block = /*openStatus*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			span2 = element("span");
    			div1 = element("div");
    			span0 = element("span");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			div0 = element("div");
    			span1 = element("span");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(path0, "d", "M540.245333 645.888L426.410667 522.069333l1.365333-1.536a889.770667 889.770667 0 0 0 166.314667-322.048h131.413333V99.669333H411.562667V1.109333h-89.6v98.645334H7.850667v98.730666h500.906666a797.696 797.696 0 0 1-142.165333 263.936 778.581333 778.581333 0 0 1-103.594667-165.290666h-89.6c33.621333 82.176 78.677333 158.037333 133.546667 224.938666L78.848 769.706667l63.658667 69.973333 224.170666-246.613333 139.52 153.429333 34.133334-100.608z m252.501334-250.026667H703.061333l-201.813333 591.872h89.685333l50.261334-147.968h212.992l50.688 147.968h89.685333L792.746667 395.776zM675.242667 741.034667l72.618666-213.674667 72.704 213.674667H675.242667z");
    			attr_dev(path0, "p-id", "2048");
    			add_location(path0, file, 54, 5, 1476);
    			attr_dev(svg0, "class", "icon");
    			attr_dev(svg0, "viewBox", "0 0 1024 1024");
    			attr_dev(svg0, "version", "1.1");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "p-id", "2047");
    			attr_dev(svg0, "width", "16");
    			attr_dev(svg0, "height", "16");
    			add_location(svg0, file, 45, 4, 1304);
    			attr_dev(span0, "class", "fi_svg-container svelte-1n0l2p3");
    			add_location(span0, file, 44, 3, 1268);
    			attr_dev(path1, "d", "M3.646 5.354l-3-3 .708-.708L4 4.293l2.646-2.647.708.708-3 3L4 5.707l-.354-.353z");
    			attr_dev(path1, "fill-rule", "evenodd");
    			attr_dev(path1, "fill-opacity", "1");
    			attr_dev(path1, "stroke", "none");
    			add_location(path1, file, 69, 6, 2414);
    			attr_dev(svg1, "class", "svg");
    			attr_dev(svg1, "width", "8");
    			attr_dev(svg1, "height", "7");
    			attr_dev(svg1, "viewBox", "0 0 8 7");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file, 62, 5, 2280);
    			attr_dev(span1, "class", "fi_svg-container svelte-1n0l2p3");
    			add_location(span1, file, 61, 4, 2243);
    			attr_dev(div0, "class", "fi_chevron--chevronContainer svelte-1n0l2p3");
    			add_location(div0, file, 60, 3, 2196);
    			attr_dev(div1, "class", "fi_lang_toolbar svelte-1n0l2p3");
    			toggle_class(div1, "selected", /*openStatus*/ ctx[1]);
    			add_location(div1, file, 37, 2, 1130);

    			attr_dev(span2, "class", span2_class_value = "" + (null_to_empty(/*mode*/ ctx[0] == MenuTheme.Light
    			? "fi_lang-menu fi_theme-light"
    			: "fi_lang-menu fi_theme-dark") + " svelte-1n0l2p3"));

    			add_location(span2, file, 32, 1, 1016);
    			attr_dev(div2, "class", "fi_lang_wrap");
    			add_location(div2, file, 31, 0, 988);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, span2);
    			append_dev(span2, div1);
    			append_dev(div1, span0);
    			append_dev(span0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, span1);
    			append_dev(span1, svg1);
    			append_dev(svg1, path1);
    			append_dev(span2, t1);
    			if (if_block) if_block.m(span2, null);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", stop_propagation(/*click_handler*/ ctx[6]), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*openStatus*/ 2) {
    				toggle_class(div1, "selected", /*openStatus*/ ctx[1]);
    			}

    			if (/*openStatus*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(span2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*mode*/ 1 && span2_class_value !== (span2_class_value = "" + (null_to_empty(/*mode*/ ctx[0] == MenuTheme.Light
    			? "fi_lang-menu fi_theme-light"
    			: "fi_lang-menu fi_theme-dark") + " svelte-1n0l2p3"))) {
    				attr_dev(span2, "class", span2_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	var _a;
    	const dispath = createEventDispatcher();
    	let { mode } = $$props;
    	let langInfoList$1 = langInfoList;
    	let openStatus = false;

    	let selectLangID = langStore.status || ((_a = langInfoList$1[0]) === null || _a === void 0
    	? void 0
    	: _a.ID);

    	const toggleLanguageMenu = status => {
    		$$invalidate(1, openStatus = status === undefined ? !openStatus : status);
    	};

    	const closeLanguageMenu = () => {
    		$$invalidate(1, openStatus = false);
    	};

    	const switchLanguage = langID => {
    		$$invalidate(2, selectLangID = langID);
    		langStore.status = langID;
    		toggleLanguageMenu();
    		dispath("langChange", langID);
    	};

    	onMount(() => {
    		console.log("Figma i18n menu loaded");
    		window.addEventListener("click", closeLanguageMenu);
    	});

    	onDestroy(() => {
    		window.removeEventListener("click", closeLanguageMenu);
    	});

    	const writable_props = ['mode'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		toggleLanguageMenu();
    	};

    	const click_handler_1 = langInfo => switchLanguage(langInfo.ID);

    	$$self.$$set = $$props => {
    		if ('mode' in $$props) $$invalidate(0, mode = $$props.mode);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		translator,
    		langStore,
    		onDestroy,
    		onMount,
    		createEventDispatcher,
    		MenuTheme,
    		dispath,
    		mode,
    		langInfoList: langInfoList$1,
    		openStatus,
    		selectLangID,
    		toggleLanguageMenu,
    		closeLanguageMenu,
    		switchLanguage
    	});

    	$$self.$inject_state = $$props => {
    		if ('_a' in $$props) _a = $$props._a;
    		if ('mode' in $$props) $$invalidate(0, mode = $$props.mode);
    		if ('langInfoList' in $$props) $$invalidate(3, langInfoList$1 = $$props.langInfoList);
    		if ('openStatus' in $$props) $$invalidate(1, openStatus = $$props.openStatus);
    		if ('selectLangID' in $$props) $$invalidate(2, selectLangID = $$props.selectLangID);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		mode,
    		openStatus,
    		selectLangID,
    		langInfoList$1,
    		toggleLanguageMenu,
    		switchLanguage,
    		click_handler,
    		click_handler_1
    	];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { mode: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*mode*/ ctx[0] === undefined && !('mode' in props)) {
    			console_1$1.warn("<Menu> was created without expected prop 'mode'");
    		}
    	}

    	get mode() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mode(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ui/App.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;

    function create_fragment(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	var _a;
    	let { runMode } = $$props;
    	let langInfoList$1 = langInfoList;

    	let selectLangID = langStore.status || ((_a = langInfoList$1[0]) === null || _a === void 0
    	? void 0
    	: _a.ID);

    	let menuIns = null;
    	let mode = MenuTheme.Dark;

    	const getHomeTargetNode = () => {
    		return document.querySelectorAll("div[class^='navbar--navbarContainer']>div ")[1];
    	};

    	const getEditorTargetNode = () => {
    		return document.querySelector("div[class*='toolbar_view--rightButtonGroup']");
    	};

    	const getMenuTargetNode = () => {
    		return document.querySelector("div[class='fi_lang_wrap']");
    	};

    	const isDesignPage = () => {
    		return !!document.querySelector("div[class*='delightful_toolbar--delightfulToolbarMask']");
    	};

    	const initMenuController = () => {
    		const menuNode = getMenuTargetNode();
    		let curMode = isDesignPage() ? MenuTheme.Light : MenuTheme.Dark;

    		if (menuNode && mode == curMode) {
    			return;
    		}

    		if (menuIns && menuIns.$destroy) {
    			menuIns.$destroy();
    		}

    		mode = curMode;

    		menuIns = new Menu({
    				target: getHomeTargetNode() || getEditorTargetNode(),
    				props: { mode }
    			});

    		menuIns.$on("langChange", event => {
    			selectLangID = event.detail;
    			languageConverter([document.body], selectLangID);
    		});
    	};

    	let observer = new MutationObserver(function (mutations) {
    			initMenuController();

    			if (runMode == RunMode.Dev) {
    				for (const mutation of mutations) {
    					const nodes = mutation.addedNodes;

    					if (!nodes || nodes.length == 0) {
    						continue;
    					}

    					nodes.forEach(node => {
    						let element = node;
    						console.log(element.innerHTML);
    					});
    				}
    			}

    			languageConverter([document.body], selectLangID);
    		});

    	onMount(() => {
    		console.log("Figma i18n loaded");
    		languageConverter([document.body], selectLangID);

    		observer.observe(document.body, {
    			childList: true,
    			subtree: true,
    			characterData: true
    		});

    		initMenuController();
    	});

    	onDestroy(() => {
    		observer.disconnect();

    		if (menuIns && menuIns.$destroy) {
    			menuIns.$destroy();
    		}
    	});

    	const writable_props = ['runMode'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('runMode' in $$props) $$invalidate(0, runMode = $$props.runMode);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		translator,
    		langStore,
    		onDestroy,
    		onMount,
    		RunMode,
    		MenuTheme,
    		Menu,
    		runMode,
    		langInfoList: langInfoList$1,
    		selectLangID,
    		menuIns,
    		mode,
    		getHomeTargetNode,
    		getEditorTargetNode,
    		getMenuTargetNode,
    		isDesignPage,
    		initMenuController,
    		observer
    	});

    	$$self.$inject_state = $$props => {
    		if ('_a' in $$props) _a = $$props._a;
    		if ('runMode' in $$props) $$invalidate(0, runMode = $$props.runMode);
    		if ('langInfoList' in $$props) langInfoList$1 = $$props.langInfoList;
    		if ('selectLangID' in $$props) selectLangID = $$props.selectLangID;
    		if ('menuIns' in $$props) menuIns = $$props.menuIns;
    		if ('mode' in $$props) mode = $$props.mode;
    		if ('observer' in $$props) observer = $$props.observer;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [runMode];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { runMode: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*runMode*/ ctx[0] === undefined && !('runMode' in props)) {
    			console_1.warn("<App> was created without expected prop 'runMode'");
    		}
    	}

    	get runMode() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set runMode(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            runMode: RunMode.Dev
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
