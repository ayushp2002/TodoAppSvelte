
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
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
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
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
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

    /* src/Task.svelte generated by Svelte v3.46.4 */
    const file$4 = "src/Task.svelte";

    // (21:8) {:else}
    function create_else_block(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "checkbox");
    			attr_dev(input, "class", "svelte-1nk90tq");
    			add_location(input, file$4, 21, 12, 543);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*click_handler_1*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(21:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#if complete}
    function create_if_block$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "checkbox");
    			input.checked = true;
    			attr_dev(input, "class", "svelte-1nk90tq");
    			add_location(input, file$4, 11, 12, 234);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(11:8) {#if complete}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let div0;
    	let t0;
    	let p;
    	let t1;
    	let t2;
    	let div1;
    	let button0;
    	let t4;
    	let button1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*complete*/ ctx[1]) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			p = element("p");
    			t1 = text(/*taskText*/ ctx[0]);
    			t2 = space();
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "Edit";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Delete";
    			attr_dev(p, "class", "svelte-1nk90tq");
    			add_location(p, file$4, 30, 8, 822);
    			attr_dev(div0, "class", "task svelte-1nk90tq");
    			add_location(div0, file$4, 9, 4, 180);
    			attr_dev(button0, "id", "edit");
    			attr_dev(button0, "class", "svelte-1nk90tq");
    			add_location(button0, file$4, 33, 8, 884);
    			attr_dev(button1, "id", "delete");
    			attr_dev(button1, "class", "svelte-1nk90tq");
    			add_location(button1, file$4, 34, 8, 958);
    			attr_dev(div1, "class", "action svelte-1nk90tq");
    			add_location(div1, file$4, 32, 4, 855);
    			attr_dev(main, "class", "svelte-1nk90tq");
    			add_location(main, file$4, 8, 0, 169);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			if_block.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			append_dev(p, t1);
    			append_dev(main, t2);
    			append_dev(main, div1);
    			append_dev(div1, button0);
    			append_dev(div1, t4);
    			append_dev(div1, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, t0);
    				}
    			}

    			if (dirty & /*taskText*/ 1) set_data_dev(t1, /*taskText*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Task', slots, []);
    	const dispatch = createEventDispatcher();
    	let { taskText } = $$props;
    	let { complete } = $$props;
    	const writable_props = ['taskText', 'complete'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Task> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("check", {
    		status: document.getElementById("checkbox").checked
    	});

    	const click_handler_1 = () => dispatch("check", {
    		status: document.getElementById("checkbox").checked
    	});

    	const click_handler_2 = () => dispatch("edit");
    	const click_handler_3 = () => dispatch("remove");

    	$$self.$$set = $$props => {
    		if ('taskText' in $$props) $$invalidate(0, taskText = $$props.taskText);
    		if ('complete' in $$props) $$invalidate(1, complete = $$props.complete);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		taskText,
    		complete
    	});

    	$$self.$inject_state = $$props => {
    		if ('taskText' in $$props) $$invalidate(0, taskText = $$props.taskText);
    		if ('complete' in $$props) $$invalidate(1, complete = $$props.complete);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		taskText,
    		complete,
    		dispatch,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Task extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { taskText: 0, complete: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Task",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*taskText*/ ctx[0] === undefined && !('taskText' in props)) {
    			console.warn("<Task> was created without expected prop 'taskText'");
    		}

    		if (/*complete*/ ctx[1] === undefined && !('complete' in props)) {
    			console.warn("<Task> was created without expected prop 'complete'");
    		}
    	}

    	get taskText() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set taskText(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get complete() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set complete(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Input.svelte generated by Svelte v3.46.4 */
    const file$3 = "src/Input.svelte";

    function create_fragment$3(ctx) {
    	let main;
    	let input;
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			button.textContent = "Add task";
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "newTask");
    			attr_dev(input, "class", "svelte-hcw3x6");
    			add_location(input, file$3, 8, 4, 159);
    			attr_dev(button, "class", "svelte-hcw3x6");
    			add_location(button, file$3, 9, 4, 221);
    			attr_dev(main, "class", "svelte-hcw3x6");
    			add_location(main, file$3, 7, 0, 148);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, input);
    			set_input_value(input, /*newTask*/ ctx[0]);
    			append_dev(main, t0);
    			append_dev(main, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*newTask*/ 1 && input.value !== /*newTask*/ ctx[0]) {
    				set_input_value(input, /*newTask*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	const dispatch = createEventDispatcher();
    	let { newTask = "" } = $$props;
    	const writable_props = ['newTask'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		newTask = this.value;
    		$$invalidate(0, newTask);
    	}

    	const click_handler = () => dispatch("add");

    	$$self.$$set = $$props => {
    		if ('newTask' in $$props) $$invalidate(0, newTask = $$props.newTask);
    	};

    	$$self.$capture_state = () => ({ createEventDispatcher, dispatch, newTask });

    	$$self.$inject_state = $$props => {
    		if ('newTask' in $$props) $$invalidate(0, newTask = $$props.newTask);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [newTask, dispatch, input_input_handler, click_handler];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { newTask: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get newTask() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set newTask(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Filters.svelte generated by Svelte v3.46.4 */
    const file$2 = "src/Filters.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			button0 = element("button");
    			button0.textContent = "All";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Pending";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "Completed";
    			attr_dev(button0, "id", "btnFilterAll");
    			attr_dev(button0, "class", "svelte-1dupnja");
    			toggle_class(button0, "active", /*activeClassAll*/ ctx[0]);
    			add_location(button0, file$2, 11, 4, 235);
    			attr_dev(button1, "id", "btnFilterPending");
    			attr_dev(button1, "class", "svelte-1dupnja");
    			toggle_class(button1, "active", /*activeClassPending*/ ctx[1]);
    			add_location(button1, file$2, 22, 4, 613);
    			attr_dev(button2, "id", "btnFilterComplete");
    			attr_dev(button2, "class", "svelte-1dupnja");
    			toggle_class(button2, "active", /*activeClassComplete*/ ctx[2]);
    			add_location(button2, file$2, 33, 4, 1019);
    			attr_dev(main, "class", "svelte-1dupnja");
    			add_location(main, file$2, 10, 0, 224);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, button0);
    			append_dev(main, t1);
    			append_dev(main, button1);
    			append_dev(main, t3);
    			append_dev(main, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[5], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activeClassAll*/ 1) {
    				toggle_class(button0, "active", /*activeClassAll*/ ctx[0]);
    			}

    			if (dirty & /*activeClassPending*/ 2) {
    				toggle_class(button1, "active", /*activeClassPending*/ ctx[1]);
    			}

    			if (dirty & /*activeClassComplete*/ 4) {
    				toggle_class(button2, "active", /*activeClassComplete*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filters', slots, []);
    	const dispatch = createEventDispatcher();
    	let activeClassAll = true;
    	let activeClassPending = false;
    	let activeClassComplete = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filters> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		dispatch("filter", { filterType: "all" });
    		$$invalidate(0, activeClassAll = !activeClassAll ? !activeClassAll : activeClassAll);
    		$$invalidate(1, activeClassPending = false);
    		$$invalidate(2, activeClassComplete = false);
    	};

    	const click_handler_1 = e => {
    		dispatch("filter", { filterType: "pending" });

    		$$invalidate(1, activeClassPending = !activeClassPending
    		? !activeClassPending
    		: activeClassPending);

    		$$invalidate(0, activeClassAll = false);
    		$$invalidate(2, activeClassComplete = false);
    	};

    	const click_handler_2 = e => {
    		dispatch("filter", { filterType: "completed" });

    		$$invalidate(2, activeClassComplete = !activeClassComplete
    		? !activeClassComplete
    		: activeClassComplete);

    		$$invalidate(1, activeClassPending = false);
    		$$invalidate(0, activeClassAll = false);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		activeClassAll,
    		activeClassPending,
    		activeClassComplete
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeClassAll' in $$props) $$invalidate(0, activeClassAll = $$props.activeClassAll);
    		if ('activeClassPending' in $$props) $$invalidate(1, activeClassPending = $$props.activeClassPending);
    		if ('activeClassComplete' in $$props) $$invalidate(2, activeClassComplete = $$props.activeClassComplete);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		activeClassAll,
    		activeClassPending,
    		activeClassComplete,
    		dispatch,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Filters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filters",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/OtherActions.svelte generated by Svelte v3.46.4 */
    const file$1 = "src/OtherActions.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			button0 = element("button");
    			button0.textContent = "Complete all";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Uncheck all";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "Delete completed";
    			attr_dev(button0, "class", "svelte-1o92esm");
    			add_location(button0, file$1, 6, 4, 129);
    			attr_dev(button1, "id", "btnUncheckAll");
    			attr_dev(button1, "class", "svelte-1o92esm");
    			add_location(button1, file$1, 7, 4, 204);
    			attr_dev(button2, "id", "btndelcomplete");
    			attr_dev(button2, "class", "svelte-1o92esm");
    			add_location(button2, file$1, 8, 4, 296);
    			attr_dev(main, "class", "svelte-1o92esm");
    			add_location(main, file$1, 5, 0, 118);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, button0);
    			append_dev(main, t1);
    			append_dev(main, button1);
    			append_dev(main, t3);
    			append_dev(main, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('OtherActions', slots, []);
    	const dispatch = createEventDispatcher();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OtherActions> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("completeAll");
    	const click_handler_1 = () => dispatch("uncheckAll");
    	const click_handler_2 = () => dispatch("delCompleted");
    	$$self.$capture_state = () => ({ createEventDispatcher, dispatch });
    	return [dispatch, click_handler, click_handler_1, click_handler_2];
    }

    class OtherActions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OtherActions",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	child_ctx[34] = list;
    	child_ctx[35] = i;
    	return child_ctx;
    }

    // (126:38) 
    function create_if_block_3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*task*/ ctx[33].complete && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*task*/ ctx[33].complete) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*tasks*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(126:38) ",
    		ctx
    	});

    	return block;
    }

    // (114:36) 
    function create_if_block_1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*task*/ ctx[33].complete && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*task*/ ctx[33].complete) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*tasks*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(114:36) ",
    		ctx
    	});

    	return block;
    }

    // (104:6) {#if filter == "all"}
    function create_if_block(ctx) {
    	let task;
    	let updating_taskText;
    	let updating_complete;
    	let current;

    	function task_taskText_binding(value) {
    		/*task_taskText_binding*/ ctx[17](value, /*task*/ ctx[33]);
    	}

    	function task_complete_binding(value) {
    		/*task_complete_binding*/ ctx[18](value, /*task*/ ctx[33]);
    	}

    	function remove_handler() {
    		return /*remove_handler*/ ctx[19](/*task*/ ctx[33]);
    	}

    	function edit_handler() {
    		return /*edit_handler*/ ctx[20](/*task*/ ctx[33]);
    	}

    	function check_handler(...args) {
    		return /*check_handler*/ ctx[21](/*task*/ ctx[33], /*each_value*/ ctx[34], /*task_index*/ ctx[35], ...args);
    	}

    	let task_props = {};

    	if (/*task*/ ctx[33].text !== void 0) {
    		task_props.taskText = /*task*/ ctx[33].text;
    	}

    	if (/*task*/ ctx[33].complete !== void 0) {
    		task_props.complete = /*task*/ ctx[33].complete;
    	}

    	task = new Task({ props: task_props, $$inline: true });
    	binding_callbacks.push(() => bind(task, 'taskText', task_taskText_binding));
    	binding_callbacks.push(() => bind(task, 'complete', task_complete_binding));
    	task.$on("remove", remove_handler);
    	task.$on("edit", edit_handler);
    	task.$on("check", check_handler);

    	const block = {
    		c: function create() {
    			create_component(task.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(task, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const task_changes = {};

    			if (!updating_taskText && dirty[0] & /*tasks*/ 4) {
    				updating_taskText = true;
    				task_changes.taskText = /*task*/ ctx[33].text;
    				add_flush_callback(() => updating_taskText = false);
    			}

    			if (!updating_complete && dirty[0] & /*tasks*/ 4) {
    				updating_complete = true;
    				task_changes.complete = /*task*/ ctx[33].complete;
    				add_flush_callback(() => updating_complete = false);
    			}

    			task.$set(task_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(task.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(task.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(task, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(104:6) {#if filter == \\\"all\\\"}",
    		ctx
    	});

    	return block;
    }

    // (127:7) {#if task.complete}
    function create_if_block_4(ctx) {
    	let task;
    	let updating_taskText;
    	let updating_complete;
    	let current;

    	function task_taskText_binding_2(value) {
    		/*task_taskText_binding_2*/ ctx[27](value, /*task*/ ctx[33]);
    	}

    	function task_complete_binding_2(value) {
    		/*task_complete_binding_2*/ ctx[28](value, /*task*/ ctx[33]);
    	}

    	function remove_handler_2() {
    		return /*remove_handler_2*/ ctx[29](/*task*/ ctx[33]);
    	}

    	function edit_handler_2() {
    		return /*edit_handler_2*/ ctx[30](/*task*/ ctx[33]);
    	}

    	function check_handler_2(...args) {
    		return /*check_handler_2*/ ctx[31](/*task*/ ctx[33], /*each_value*/ ctx[34], /*task_index*/ ctx[35], ...args);
    	}

    	let task_props = {};

    	if (/*task*/ ctx[33].text !== void 0) {
    		task_props.taskText = /*task*/ ctx[33].text;
    	}

    	if (/*task*/ ctx[33].complete !== void 0) {
    		task_props.complete = /*task*/ ctx[33].complete;
    	}

    	task = new Task({ props: task_props, $$inline: true });
    	binding_callbacks.push(() => bind(task, 'taskText', task_taskText_binding_2));
    	binding_callbacks.push(() => bind(task, 'complete', task_complete_binding_2));
    	task.$on("remove", remove_handler_2);
    	task.$on("edit", edit_handler_2);
    	task.$on("check", check_handler_2);

    	const block = {
    		c: function create() {
    			create_component(task.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(task, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const task_changes = {};

    			if (!updating_taskText && dirty[0] & /*tasks*/ 4) {
    				updating_taskText = true;
    				task_changes.taskText = /*task*/ ctx[33].text;
    				add_flush_callback(() => updating_taskText = false);
    			}

    			if (!updating_complete && dirty[0] & /*tasks*/ 4) {
    				updating_complete = true;
    				task_changes.complete = /*task*/ ctx[33].complete;
    				add_flush_callback(() => updating_complete = false);
    			}

    			task.$set(task_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(task.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(task.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(task, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(127:7) {#if task.complete}",
    		ctx
    	});

    	return block;
    }

    // (115:7) {#if !task.complete}
    function create_if_block_2(ctx) {
    	let task;
    	let updating_taskText;
    	let updating_complete;
    	let current;

    	function task_taskText_binding_1(value) {
    		/*task_taskText_binding_1*/ ctx[22](value, /*task*/ ctx[33]);
    	}

    	function task_complete_binding_1(value) {
    		/*task_complete_binding_1*/ ctx[23](value, /*task*/ ctx[33]);
    	}

    	function remove_handler_1() {
    		return /*remove_handler_1*/ ctx[24](/*task*/ ctx[33]);
    	}

    	function edit_handler_1() {
    		return /*edit_handler_1*/ ctx[25](/*task*/ ctx[33]);
    	}

    	function check_handler_1(...args) {
    		return /*check_handler_1*/ ctx[26](/*task*/ ctx[33], /*each_value*/ ctx[34], /*task_index*/ ctx[35], ...args);
    	}

    	let task_props = {};

    	if (/*task*/ ctx[33].text !== void 0) {
    		task_props.taskText = /*task*/ ctx[33].text;
    	}

    	if (/*task*/ ctx[33].complete !== void 0) {
    		task_props.complete = /*task*/ ctx[33].complete;
    	}

    	task = new Task({ props: task_props, $$inline: true });
    	binding_callbacks.push(() => bind(task, 'taskText', task_taskText_binding_1));
    	binding_callbacks.push(() => bind(task, 'complete', task_complete_binding_1));
    	task.$on("remove", remove_handler_1);
    	task.$on("edit", edit_handler_1);
    	task.$on("check", check_handler_1);

    	const block = {
    		c: function create() {
    			create_component(task.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(task, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const task_changes = {};

    			if (!updating_taskText && dirty[0] & /*tasks*/ 4) {
    				updating_taskText = true;
    				task_changes.taskText = /*task*/ ctx[33].text;
    				add_flush_callback(() => updating_taskText = false);
    			}

    			if (!updating_complete && dirty[0] & /*tasks*/ 4) {
    				updating_complete = true;
    				task_changes.complete = /*task*/ ctx[33].complete;
    				add_flush_callback(() => updating_complete = false);
    			}

    			task.$set(task_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(task.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(task.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(task, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(115:7) {#if !task.complete}",
    		ctx
    	});

    	return block;
    }

    // (102:4) {#each tasks as task}
    function create_each_block(ctx) {
    	let li;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*filter*/ ctx[3] == "all") return 0;
    		if (/*filter*/ ctx[3] == "pending") return 1;
    		if (/*filter*/ ctx[3] == "completed") return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (if_block) if_block.c();
    			t = space();
    			add_location(li, file, 102, 5, 2132);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(li, null);
    			}

    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(li, t);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(102:4) {#each tasks as task}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div2;
    	let div0;
    	let h1;
    	let t1;
    	let input;
    	let updating_newTask;
    	let t2;
    	let h20;
    	let t4;
    	let filters;
    	let t5;
    	let h21;
    	let t7;
    	let otheractions;
    	let t8;
    	let div1;
    	let h22;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let t13;
    	let ul;
    	let current;

    	function input_newTask_binding(value) {
    		/*input_newTask_binding*/ ctx[11](value);
    	}

    	let input_props = {};

    	if (/*newTaskText*/ ctx[4] !== void 0) {
    		input_props.newTask = /*newTaskText*/ ctx[4];
    	}

    	input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, 'newTask', input_newTask_binding));
    	input.$on("add", /*add_handler*/ ctx[12]);
    	filters = new Filters({ $$inline: true });
    	filters.$on("filter", /*filter_handler*/ ctx[13]);
    	otheractions = new OtherActions({ $$inline: true });
    	otheractions.$on("completeAll", /*completeAll_handler*/ ctx[14]);
    	otheractions.$on("uncheckAll", /*uncheckAll_handler*/ ctx[15]);
    	otheractions.$on("delCompleted", /*delCompleted_handler*/ ctx[16]);
    	let each_value = /*tasks*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Todo";
    			t1 = space();
    			create_component(input.$$.fragment);
    			t2 = space();
    			h20 = element("h2");
    			h20.textContent = "Filters";
    			t4 = space();
    			create_component(filters.$$.fragment);
    			t5 = space();
    			h21 = element("h2");
    			h21.textContent = "Other Actions";
    			t7 = space();
    			create_component(otheractions.$$.fragment);
    			t8 = space();
    			div1 = element("div");
    			h22 = element("h2");
    			t9 = text(/*completeCount*/ ctx[1]);
    			t10 = text(" of ");
    			t11 = text(/*ctr*/ ctx[0]);
    			t12 = text(" Tasks completed");
    			t13 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file, 82, 3, 1627);
    			add_location(h20, file, 84, 3, 1712);
    			add_location(h21, file, 91, 3, 1836);
    			attr_dev(div0, "class", "leftpane svelte-1dk262r");
    			add_location(div0, file, 81, 2, 1601);
    			add_location(h22, file, 99, 3, 2043);
    			attr_dev(ul, "class", "svelte-1dk262r");
    			add_location(ul, file, 100, 3, 2096);
    			attr_dev(div1, "class", "rightpane svelte-1dk262r");
    			add_location(div1, file, 98, 2, 2016);
    			attr_dev(div2, "class", "container svelte-1dk262r");
    			add_location(div2, file, 80, 1, 1575);
    			attr_dev(main, "class", "svelte-1dk262r");
    			add_location(main, file, 79, 0, 1567);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			mount_component(input, div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, h20);
    			append_dev(div0, t4);
    			mount_component(filters, div0, null);
    			append_dev(div0, t5);
    			append_dev(div0, h21);
    			append_dev(div0, t7);
    			mount_component(otheractions, div0, null);
    			append_dev(div2, t8);
    			append_dev(div2, div1);
    			append_dev(div1, h22);
    			append_dev(h22, t9);
    			append_dev(h22, t10);
    			append_dev(h22, t11);
    			append_dev(h22, t12);
    			append_dev(div1, t13);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};

    			if (!updating_newTask && dirty[0] & /*newTaskText*/ 16) {
    				updating_newTask = true;
    				input_changes.newTask = /*newTaskText*/ ctx[4];
    				add_flush_callback(() => updating_newTask = false);
    			}

    			input.$set(input_changes);
    			if (!current || dirty[0] & /*completeCount*/ 2) set_data_dev(t9, /*completeCount*/ ctx[1]);
    			if (!current || dirty[0] & /*ctr*/ 1) set_data_dev(t11, /*ctr*/ ctx[0]);

    			if (dirty[0] & /*tasks, deleteTask, editTask, filter*/ 204) {
    				each_value = /*tasks*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			transition_in(filters.$$.fragment, local);
    			transition_in(otheractions.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			transition_out(filters.$$.fragment, local);
    			transition_out(otheractions.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(input);
    			destroy_component(filters);
    			destroy_component(otheractions);
    			destroy_each(each_blocks, detaching);
    		}
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
    	let ctr = 1;
    	let completeCount = 0;

    	let tasks = [
    		{
    			id: 0,
    			text: "This is a Todo",
    			complete: false
    		}
    	];

    	let filter = "all";
    	let newTaskText = "";

    	function addNewTask(taskText) {
    		if (newTaskText.length > 0) {
    			tasks.push({
    				id: ctr,
    				text: newTaskText,
    				complete: false
    			});

    			$$invalidate(0, ctr = ctr + 1);
    			$$invalidate(2, tasks);
    		}
    	}

    	function deleteTask(index) {
    		if (index != undefined) {
    			tasks.splice(tasks.indexOf(tasks.find(elem => elem.id == index)), 1);
    			$$invalidate(2, tasks);
    			$$invalidate(0, ctr = ctr - 1);
    		}
    	}

    	function editTask(index) {
    		if (index != undefined) {
    			let newText = prompt("Enter new text");

    			if (newText != undefined) {
    				$$invalidate(2, tasks[tasks.indexOf(tasks.find(elem => elem.id == index))].text = newText, tasks);
    			}
    		}
    	}

    	function updateCompleteCount(items) {
    		$$invalidate(1, completeCount = 0);

    		items.forEach(item => {
    			if (item.complete) {
    				$$invalidate(1, completeCount = completeCount + 1);
    			}
    		});
    	}

    	function completeAll() {
    		tasks.forEach(task => {
    			task.complete = true;
    		});

    		$$invalidate(2, tasks);
    	}

    	function uncheckAll() {
    		tasks.forEach(task => {
    			task.complete = false;
    		});

    		$$invalidate(2, tasks);
    	}

    	function delCompleted() {
    		for (let i = tasks.length - 1; i >= 0; i--) {
    			if (tasks[i].complete) {
    				deleteTask(tasks[i].id);
    			}
    		}

    		$$invalidate(2, tasks);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_newTask_binding(value) {
    		newTaskText = value;
    		$$invalidate(4, newTaskText);
    	}

    	const add_handler = () => addNewTask();

    	const filter_handler = e => {
    		$$invalidate(3, filter = e.detail.filterType);
    		$$invalidate(2, tasks);
    	};

    	const completeAll_handler = () => completeAll();
    	const uncheckAll_handler = () => uncheckAll();
    	const delCompleted_handler = () => delCompleted();

    	function task_taskText_binding(value, task) {
    		if ($$self.$$.not_equal(task.text, value)) {
    			task.text = value;
    			$$invalidate(2, tasks);
    		}
    	}

    	function task_complete_binding(value, task) {
    		if ($$self.$$.not_equal(task.complete, value)) {
    			task.complete = value;
    			$$invalidate(2, tasks);
    		}
    	}

    	const remove_handler = task => deleteTask(task.id);
    	const edit_handler = task => editTask(task.id);

    	const check_handler = (task, each_value, task_index, e) => {
    		$$invalidate(2, each_value[task_index].complete = !task.complete, tasks);
    	};

    	function task_taskText_binding_1(value, task) {
    		if ($$self.$$.not_equal(task.text, value)) {
    			task.text = value;
    			$$invalidate(2, tasks);
    		}
    	}

    	function task_complete_binding_1(value, task) {
    		if ($$self.$$.not_equal(task.complete, value)) {
    			task.complete = value;
    			$$invalidate(2, tasks);
    		}
    	}

    	const remove_handler_1 = task => deleteTask(task.id);
    	const edit_handler_1 = task => editTask(task.id);

    	const check_handler_1 = (task, each_value, task_index, e) => {
    		$$invalidate(2, each_value[task_index].complete = !task.complete, tasks);
    	};

    	function task_taskText_binding_2(value, task) {
    		if ($$self.$$.not_equal(task.text, value)) {
    			task.text = value;
    			$$invalidate(2, tasks);
    		}
    	}

    	function task_complete_binding_2(value, task) {
    		if ($$self.$$.not_equal(task.complete, value)) {
    			task.complete = value;
    			$$invalidate(2, tasks);
    		}
    	}

    	const remove_handler_2 = task => deleteTask(task.id);
    	const edit_handler_2 = task => editTask(task.id);

    	const check_handler_2 = (task, each_value, task_index, e) => {
    		$$invalidate(2, each_value[task_index].complete = !task.complete, tasks);
    	};

    	$$self.$capture_state = () => ({
    		Task,
    		Input,
    		Filters,
    		OtherActions,
    		ctr,
    		completeCount,
    		tasks,
    		filter,
    		newTaskText,
    		addNewTask,
    		deleteTask,
    		editTask,
    		updateCompleteCount,
    		completeAll,
    		uncheckAll,
    		delCompleted
    	});

    	$$self.$inject_state = $$props => {
    		if ('ctr' in $$props) $$invalidate(0, ctr = $$props.ctr);
    		if ('completeCount' in $$props) $$invalidate(1, completeCount = $$props.completeCount);
    		if ('tasks' in $$props) $$invalidate(2, tasks = $$props.tasks);
    		if ('filter' in $$props) $$invalidate(3, filter = $$props.filter);
    		if ('newTaskText' in $$props) $$invalidate(4, newTaskText = $$props.newTaskText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*tasks*/ 4) {
    			updateCompleteCount(tasks);
    		}

    		if ($$self.$$.dirty[0] & /*completeCount*/ 2) {
    			$$invalidate(1, completeCount);
    		}

    		if ($$self.$$.dirty[0] & /*ctr*/ 1) {
    			$$invalidate(0, ctr);
    		}
    	};

    	return [
    		ctr,
    		completeCount,
    		tasks,
    		filter,
    		newTaskText,
    		addNewTask,
    		deleteTask,
    		editTask,
    		completeAll,
    		uncheckAll,
    		delCompleted,
    		input_newTask_binding,
    		add_handler,
    		filter_handler,
    		completeAll_handler,
    		uncheckAll_handler,
    		delCompleted_handler,
    		task_taskText_binding,
    		task_complete_binding,
    		remove_handler,
    		edit_handler,
    		check_handler,
    		task_taskText_binding_1,
    		task_complete_binding_1,
    		remove_handler_1,
    		edit_handler_1,
    		check_handler_1,
    		task_taskText_binding_2,
    		task_complete_binding_2,
    		remove_handler_2,
    		edit_handler_2,
    		check_handler_2
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
