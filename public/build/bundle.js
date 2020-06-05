
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
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
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
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
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
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
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
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
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.23.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const fileUploaded = writable(false);

    const terminalText = writable(null);

    const loadedStore = writable(false);

    const transcoded = writable(false);

    const { createFFmpeg } = FFmpeg;
    const ffmpeg = createFFmpeg({
      log: true,
      progress: ({ ratio }) => {
        let value = (ratio * 100.0).toFixed(2);
        if (value > 0) {
          terminalText.update((existing) => `Complete: ${value}%`);
        }
      },
    });
    (async () => {
      try {
        await ffmpeg.load();
      } catch (err) {
        alert(`Your Browser is not supported ${err.message}`);
      }
      console.log("Loaded!");
      loadedStore.update((existing) => true);
    })();

    let transcode = async ({ target: { files } }) => {
      const { name } = files[0];
      await console.log(name);

      terminalText.update((existing) => "Start processing");
      await console.log("it works");
      await ffmpeg.write(name, files[0]);
      let threads = window.navigator.hardwareConcurrency;
      threads = threads < 8 ? threads : 8;

      await ffmpeg.run(
        `-i ${name} ${
       ""
    } output.mp4 -threads ${threads}`
      );
      terminalText.update((existing) => "Complete processing");
      const data = ffmpeg.read("output.mp4");
      let blobUrl = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
      transcoded.update((existing) => blobUrl);
      //   t1.clear();
      terminalText.update(
        (existing) => "The processing is complete! Enjoy your video"
      );
    };

    fileUploaded.subscribe((files) => {
      transcode({ target: { files: files } });
    });

    /* src/components/header.svelte generated by Svelte v3.23.0 */

    const file = "src/components/header.svelte";

    function create_fragment(ctx) {
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "WASM Video Transcoder";
    			attr_dev(h1, "class", "title svelte-1nmave3");
    			add_location(h1, file, 12, 2, 122);
    			attr_dev(div, "class", "header");
    			add_location(div, file, 11, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    function instance($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Header", $$slots, []);
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/components/terminal.svelte generated by Svelte v3.23.0 */
    const file$1 = "src/components/terminal.svelte";

    function create_fragment$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "id", "terminal");
    			add_location(div, file$1, 71, 0, 2318);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	let $loadedStore;
    	let $terminalText;
    	validate_store(loadedStore, "loadedStore");
    	component_subscribe($$self, loadedStore, $$value => $$invalidate(2, $loadedStore = $$value));
    	validate_store(terminalText, "terminalText");
    	component_subscribe($$self, terminalText, $$value => $$invalidate(3, $terminalText = $$value));
    	const t1 = new Terminal();

    	const handleNewMessage = function (message, noflag) {
    		if (message) {
    			terminalMessage = message;
    			t1.print(`${noflag ? "" : "$"} ${message}`);
    			let terminalEmulator = document.getElementById("terminalEmulator");

    			if (terminalEmulator) {
    				terminalEmulator.scrollTop = terminalEmulator.scrollHeight;
    			}
    		}
    	};

    	const addSpecialMessage = function (message, noflag) {
    		let terminalEmulator = document.getElementById("terminalEmulator");

    		if (terminalEmulator) {
    			let mainDiv = terminalEmulator.childNodes[0];
    			let pTag = mainDiv.childNodes[0];
    			let newDiv = document.createElement("div");
    			newDiv.innerHTML = message;
    			pTag.appendChild(newDiv);
    		}
    	};

    	onMount(() => {
    		t1.setBackgroundColor("#263238");
    		t1.setTextColor("#76ff03");
    		t1.setHeight("35vh");
    		t1.blinkingCursor(true);
    		t1.html.style.fontFamily = "Ubuntu Mono";
    		t1.html.id = "terminalEmulator";
    		t1.html.style.overflow = "auto";
    		t1.html.style = "text-align: left; height: 35vh; font-family: Ubuntu Mono; overflow: auto; width : 60vh; display : flex; font-size: 20px; background-color : rgb(38, 50, 56, 0.8)";
    		let terminalDiv = document.getElementById("terminal");
    		terminalDiv.appendChild(t1.html);
    		handleNewMessage("Hello, I am a Video Transcoder!", true);
    		handleNewMessage("But I am slightly different than other online video tools, because I don't upload your files anywhere.", true);
    		handleNewMessage("Instead I protect your privacy by doing all the computation on your browser locally.", true);
    		addSpecialMessage(`I do this by using the amazing new technology called <a style="color: #ff3e00" href="https://webassembly.org/" target="_blank" rel="noopener noreferrer">web assembly</a>.`);
    		let loaded = $loadedStore;

    		loadedStore.subscribe(val => {
    			loaded = val;

    			if (loaded) {
    				handleNewMessage("Loaded FFmpeg!");
    			}
    		});
    	});

    	let terminalMessage = $terminalText;
    	terminalText.subscribe(value => handleNewMessage(value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Terminal> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Terminal", $$slots, []);

    	$$self.$capture_state = () => ({
    		terminalText,
    		loadedStore,
    		onMount,
    		t1,
    		handleNewMessage,
    		addSpecialMessage,
    		terminalMessage,
    		$loadedStore,
    		$terminalText
    	});

    	$$self.$inject_state = $$props => {
    		if ("terminalMessage" in $$props) terminalMessage = $$props.terminalMessage;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Terminal_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Terminal_1",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/components/container.svelte generated by Svelte v3.23.0 */

    const file$2 = "src/components/container.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let h1;
    	let t0;
    	let t1;
    	let div0;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(h1, "class", "container-title svelte-wbkvmj");
    			add_location(h1, file$2, 19, 2, 278);
    			attr_dev(div0, "class", "container-content");
    			add_location(div0, file$2, 20, 2, 321);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file$2, 18, 0, 252);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(h1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
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
    	let { title = "Add a file" } = $$props;
    	const writable_props = ["title"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Container> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Container", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title });

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, $$scope, $$slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get title() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-dropzone/index.svelte generated by Svelte v3.23.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file$3 = "node_modules/svelte-dropzone/index.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let t;
    	let input;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			input = element("input");
    			input.hidden = true;
    			attr_dev(input, "name", "sites_data");
    			attr_dev(input, "type", "file");
    			add_location(input, file$3, 68, 2, 1772);
    			attr_dev(div, "action", "#");
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*dropzoneClass*/ ctx[0]) + " svelte-1w97s0m"));
    			attr_dev(div, "id", /*id*/ ctx[1]);
    			add_location(div, file$3, 66, 0, 1715);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t);
    			append_dev(div, input);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*dropzoneClass*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(/*dropzoneClass*/ ctx[0]) + " svelte-1w97s0m"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*id*/ 2) {
    				attr_dev(div, "id", /*id*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
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
    	let { dropzoneEvents = {} } = $$props;
    	let { options = { previewTemplate: "<div/>" } } = $$props;
    	let { dropzoneClass = "dropzone" } = $$props;
    	let { hooveringClass = "dropzone-hoovering" } = $$props;
    	let { id = "dropId" } = $$props;
    	let { autoDiscover = false } = $$props;

    	onMount(() => {
    		const dropzoneElement = document.getElementById(id);

    		if (!options.previewTemplate) {
    			$$invalidate(2, options.previewTemplate = "<div/>", options);
    		}

    		if (!options.dictDefaultMessage) {
    			$$invalidate(2, options.dictDefaultMessage = "", options);
    		}

    		let svDropzone = new Dropzone(`div#${id}`, { ...options });

    		if (autoDiscover === true) {
    			svDropzone.autoDiscover = true;
    		}

    		svDropzone.on("addedfile", f => {
    			dropzoneElement.classList.remove(hooveringClass);
    		});

    		svDropzone.on("dragenter", e => {
    			console.log(dropzoneElement);
    			dropzoneElement.classList.toggle(hooveringClass);
    		});

    		svDropzone.on("dragleave", e => {
    			dropzoneElement.classList.toggle(hooveringClass);
    		});

    		Object.entries(dropzoneEvents).map(([eventKey, eventFunc]) => svDropzone.on(eventKey, eventFunc));

    		if (options.clickable !== false) {
    			dropzoneElement.style.cursor = "pointer";
    		}

    		svDropzone.on("error", (file, errorMessage) => {
    			console.error(`Error: ${errorMessage}`);
    		});
    	});

    	const writable_props = [
    		"dropzoneEvents",
    		"options",
    		"dropzoneClass",
    		"hooveringClass",
    		"id",
    		"autoDiscover"
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Svelte_dropzone> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Svelte_dropzone", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("dropzoneEvents" in $$props) $$invalidate(3, dropzoneEvents = $$props.dropzoneEvents);
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    		if ("dropzoneClass" in $$props) $$invalidate(0, dropzoneClass = $$props.dropzoneClass);
    		if ("hooveringClass" in $$props) $$invalidate(4, hooveringClass = $$props.hooveringClass);
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("autoDiscover" in $$props) $$invalidate(5, autoDiscover = $$props.autoDiscover);
    		if ("$$scope" in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		dropzoneEvents,
    		options,
    		dropzoneClass,
    		hooveringClass,
    		id,
    		autoDiscover
    	});

    	$$self.$inject_state = $$props => {
    		if ("dropzoneEvents" in $$props) $$invalidate(3, dropzoneEvents = $$props.dropzoneEvents);
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    		if ("dropzoneClass" in $$props) $$invalidate(0, dropzoneClass = $$props.dropzoneClass);
    		if ("hooveringClass" in $$props) $$invalidate(4, hooveringClass = $$props.hooveringClass);
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("autoDiscover" in $$props) $$invalidate(5, autoDiscover = $$props.autoDiscover);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		dropzoneClass,
    		id,
    		options,
    		dropzoneEvents,
    		hooveringClass,
    		autoDiscover,
    		$$scope,
    		$$slots
    	];
    }

    class Svelte_dropzone extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			dropzoneEvents: 3,
    			options: 2,
    			dropzoneClass: 0,
    			hooveringClass: 4,
    			id: 1,
    			autoDiscover: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Svelte_dropzone",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get dropzoneEvents() {
    		throw new Error("<Svelte_dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dropzoneEvents(value) {
    		throw new Error("<Svelte_dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Svelte_dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Svelte_dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dropzoneClass() {
    		throw new Error("<Svelte_dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dropzoneClass(value) {
    		throw new Error("<Svelte_dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hooveringClass() {
    		throw new Error("<Svelte_dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hooveringClass(value) {
    		throw new Error("<Svelte_dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Svelte_dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Svelte_dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoDiscover() {
    		throw new Error("<Svelte_dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoDiscover(value) {
    		throw new Error("<Svelte_dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => `overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src/components/dropzone.svelte generated by Svelte v3.23.0 */
    const file$4 = "src/components/dropzone.svelte";

    // (29:2) <Dropzone     dropzoneClass="dropzone"     hooveringClass="hooveringClass"     id="dropzone"     dropzoneEvents={{ addedfile, drop, init }}     options={{ clickable: true, createImageThumbnails: true, init }}>
    function create_default_slot_1(ctx) {
    	let h4;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Drop files here to process";
    			add_location(h4, file$4, 34, 4, 998);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(29:2) <Dropzone     dropzoneClass=\\\"dropzone\\\"     hooveringClass=\\\"hooveringClass\\\"     id=\\\"dropzone\\\"     dropzoneEvents={{ addedfile, drop, init }}     options={{ clickable: true, createImageThumbnails: true, init }}>",
    		ctx
    	});

    	return block;
    }

    // (28:0) <Container title="">
    function create_default_slot(ctx) {
    	let current;

    	const dropzone = new Svelte_dropzone({
    			props: {
    				dropzoneClass: "dropzone",
    				hooveringClass: "hooveringClass",
    				id: "dropzone",
    				dropzoneEvents: {
    					addedfile: /*addedfile*/ ctx[0],
    					drop: /*drop*/ ctx[1],
    					init: /*init*/ ctx[2]
    				},
    				options: {
    					clickable: true,
    					createImageThumbnails: true,
    					init: /*init*/ ctx[2]
    				},
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropzone.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropzone, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropzone_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				dropzone_changes.$$scope = { dirty, ctx };
    			}

    			dropzone.$set(dropzone_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropzone.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropzone.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropzone, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(28:0) <Container title=\\\"\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current;

    	const container = new Container({
    			props: {
    				title: "",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
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
    	const addedfile = file => {
    		uploaded = true;
    		fileUploaded.update(existing => [file]);
    		terminalText.update(existing => `File ${file.name} has begun processing!`);
    	};

    	const drop = event => {
    		uploaded = true;
    	};

    	const init = () => {
    		const dropzone = document.getElementById("dropzone");
    		dropzone.style.backgroundColor = "#272C31";
    		dropzone.style.border = "0";
    		dropzone.style.boxShadow = "inset 0 2px 4px 0 rgba(0, 0, 0, 0.08)";
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dropzone> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Dropzone", $$slots, []);

    	$$self.$capture_state = () => ({
    		fileUploaded,
    		terminalText,
    		Container,
    		Dropzone: Svelte_dropzone,
    		fly,
    		addedfile,
    		drop,
    		init,
    		uploaded
    	});

    	$$self.$inject_state = $$props => {
    		if ("uploaded" in $$props) uploaded = $$props.uploaded;
    	};

    	let uploaded;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 uploaded = null;
    	return [addedfile, drop, init];
    }

    class Dropzone_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropzone_1",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/loader.svelte generated by Svelte v3.23.0 */

    const file$5 = "src/components/loader.svelte";

    function create_fragment$5(ctx) {
    	let div5;
    	let div4;
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			p = element("p");
    			attr_dev(div0, "class", "svelte-zypt56");
    			add_location(div0, file$5, 50, 6, 912);
    			attr_dev(div1, "class", "svelte-zypt56");
    			add_location(div1, file$5, 51, 6, 926);
    			attr_dev(div2, "class", "svelte-zypt56");
    			add_location(div2, file$5, 52, 6, 940);
    			attr_dev(div3, "class", "lds-facebook svelte-zypt56");
    			attr_dev(div3, "id", "inner-loader");
    			add_location(div3, file$5, 49, 4, 861);
    			attr_dev(p, "class", "lead");
    			attr_dev(p, "style", "color : white;");
    			attr_dev(p, "id", "message");
    			add_location(p, file$5, 54, 4, 963);
    			attr_dev(div4, "class", "col col-auto-md");
    			add_location(div4, file$5, 48, 2, 827);
    			attr_dev(div5, "id", "loader");
    			attr_dev(div5, "class", "row justify-content-md-center");
    			add_location(div5, file$5, 47, 0, 769);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div4, t2);
    			append_dev(div4, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Loader> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Loader", $$slots, []);
    	return [];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/configure.svelte generated by Svelte v3.23.0 */

    const file$6 = "src/components/configure.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Configure";
    			t1 = space();
    			div0 = element("div");
    			attr_dev(h1, "class", "title svelte-10xlva3");
    			add_location(h1, file$6, 29, 2, 446);
    			attr_dev(div0, "class", "configure svelte-10xlva3");
    			add_location(div0, file$6, 30, 2, 481);
    			attr_dev(div1, "class", "container svelte-10xlva3");
    			add_location(div1, file$6, 28, 0, 420);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Configure> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Configure", $$slots, []);
    	return [];
    }

    class Configure extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Configure",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/video.svelte generated by Svelte v3.23.0 */
    const file$7 = "src/components/video.svelte";

    function create_fragment$7(ctx) {
    	let div16;
    	let div15;
    	let video;
    	let video_src_value;
    	let t0;
    	let div0;
    	let t1;
    	let div14;
    	let div1;
    	let span0;
    	let t2;
    	let span1;
    	let t3;
    	let div3;
    	let div2;
    	let t4;
    	let div13;
    	let div8;
    	let div7;
    	let div4;
    	let svg0;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let t5;
    	let div6;
    	let div5;
    	let t6;
    	let div9;
    	let t7;
    	let div12;
    	let div10;
    	let ul;
    	let li0;
    	let t9;
    	let li1;
    	let t11;
    	let li2;
    	let t13;
    	let li3;
    	let t15;
    	let li4;
    	let t17;
    	let div11;
    	let svg1;
    	let path4;

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			div15 = element("div");
    			video = element("video");
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			div14 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			t2 = space();
    			span1 = element("span");
    			t3 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t4 = space();
    			div13 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			div4 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			t5 = space();
    			div6 = element("div");
    			div5 = element("div");
    			t6 = space();
    			div9 = element("div");
    			t7 = space();
    			div12 = element("div");
    			div10 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "0.5x";
    			t9 = space();
    			li1 = element("li");
    			li1.textContent = "0.75x";
    			t11 = space();
    			li2 = element("li");
    			li2.textContent = "1x";
    			t13 = space();
    			li3 = element("li");
    			li3.textContent = "1.5x";
    			t15 = space();
    			li4 = element("li");
    			li4.textContent = "2x";
    			t17 = space();
    			div11 = element("div");
    			svg1 = svg_element("svg");
    			path4 = svg_element("path");
    			attr_dev(video, "id", "video");
    			if (video.src !== (video_src_value = "")) attr_dev(video, "src", video_src_value);
    			video.autoplay = true;
    			video.loop = true;
    			video.playsInline = true;
    			attr_dev(video, "class", "svelte-1q4rf83");
    			add_location(video, file$7, 366, 4, 9869);
    			attr_dev(div0, "class", "play-btn-big svelte-1q4rf83");
    			add_location(div0, file$7, 367, 4, 9927);
    			attr_dev(span0, "class", "time-current svelte-1q4rf83");
    			add_location(span0, file$7, 370, 8, 10016);
    			attr_dev(span1, "class", "time-total svelte-1q4rf83");
    			add_location(span1, file$7, 371, 8, 10054);
    			attr_dev(div1, "class", "time svelte-1q4rf83");
    			add_location(div1, file$7, 369, 6, 9989);
    			attr_dev(div2, "class", "progress-filled svelte-1q4rf83");
    			add_location(div2, file$7, 374, 8, 10132);
    			attr_dev(div3, "class", "progress svelte-1q4rf83");
    			add_location(div3, file$7, 373, 6, 10101);
    			attr_dev(path0, "d", "M6.75497 17.6928H2C0.89543 17.6928 0 16.7973 0\n                  15.6928V8.30611C0 7.20152 0.895431 6.30611 2\n                  6.30611H6.75504L13.9555 0.237289C14.6058 -0.310807 15.6\n                  0.151473 15.6 1.00191V22.997C15.6 23.8475 14.6058 24.3098\n                  13.9555 23.7617L6.75497 17.6928Z");
    			attr_dev(path0, "transform", "translate(0 0.000518799)");
    			attr_dev(path0, "fill", "white");
    			attr_dev(path0, "class", "svelte-1q4rf83");
    			add_location(path0, file$7, 386, 16, 10526);
    			attr_dev(path1, "id", "volume-low");
    			attr_dev(path1, "d", "M0 9.87787C2.87188 9.87787 5.2 7.66663 5.2 4.93893C5.2\n                  2.21124 2.87188 0 0 0V2C1.86563 2 3.2 3.41162 3.2 4.93893C3.2\n                  6.46625 1.86563 7.87787 0 7.87787V9.87787Z");
    			attr_dev(path1, "transform", "translate(17.3333 7.44955)");
    			attr_dev(path1, "fill", "white");
    			attr_dev(path1, "class", "svelte-1q4rf83");
    			add_location(path1, file$7, 394, 16, 10970);
    			attr_dev(path2, "id", "volume-high");
    			attr_dev(path2, "d", "M0 16.4631C4.78647 16.4631 8.66667 12.7777 8.66667\n                  8.23157C8.66667 3.68539 4.78647 0 0 0V2C3.78022 2 6.66667\n                  4.88577 6.66667 8.23157C6.66667 11.5773 3.78022 14.4631 0\n                  14.4631V16.4631Z");
    			attr_dev(path2, "transform", "translate(17.3333 4.15689)");
    			attr_dev(path2, "fill", "white");
    			attr_dev(path2, "class", "svelte-1q4rf83");
    			add_location(path2, file$7, 402, 16, 11336);
    			attr_dev(path3, "id", "volume-off");
    			attr_dev(path3, "d", "M1.22565 0L0 1.16412L3.06413 4.0744L0 6.98471L1.22565\n                  8.14883L4.28978 5.23853L7.35391 8.14883L8.57956\n                  6.98471L5.51544 4.0744L8.57956 1.16412L7.35391 0L4.28978\n                  2.91031L1.22565 0Z");
    			attr_dev(path3, "transform", "translate(17.3769 8.31403)");
    			attr_dev(path3, "fill", "white");
    			attr_dev(path3, "class", "svelte-1q4rf83");
    			add_location(path3, file$7, 410, 16, 11744);
    			attr_dev(svg0, "width", "26");
    			attr_dev(svg0, "height", "24");
    			attr_dev(svg0, "viewBox", "0 0 26 24");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "svelte-1q4rf83");
    			add_location(svg0, file$7, 380, 14, 10334);
    			attr_dev(div4, "class", "volume-btn loud svelte-1q4rf83");
    			add_location(div4, file$7, 379, 12, 10290);
    			attr_dev(div5, "class", "volume-filled svelte-1q4rf83");
    			add_location(div5, file$7, 422, 14, 12224);
    			attr_dev(div6, "class", "volume-slider svelte-1q4rf83");
    			add_location(div6, file$7, 421, 12, 12182);
    			attr_dev(div7, "class", "volume svelte-1q4rf83");
    			add_location(div7, file$7, 378, 10, 10257);
    			attr_dev(div8, "class", "controls-left svelte-1q4rf83");
    			add_location(div8, file$7, 377, 8, 10219);
    			attr_dev(div9, "class", "play-btn paused svelte-1q4rf83");
    			add_location(div9, file$7, 426, 8, 12313);
    			attr_dev(li0, "class", "speed-item svelte-1q4rf83");
    			attr_dev(li0, "data-speed", "0.5");
    			add_location(li0, file$7, 430, 14, 12462);
    			attr_dev(li1, "class", "speed-item svelte-1q4rf83");
    			attr_dev(li1, "data-speed", "0.75");
    			add_location(li1, file$7, 431, 14, 12526);
    			attr_dev(li2, "class", "speed-item active svelte-1q4rf83");
    			attr_dev(li2, "data-speed", "1");
    			add_location(li2, file$7, 432, 14, 12592);
    			attr_dev(li3, "class", "speed-item svelte-1q4rf83");
    			attr_dev(li3, "data-speed", "1.5");
    			add_location(li3, file$7, 433, 14, 12659);
    			attr_dev(li4, "class", "speed-item svelte-1q4rf83");
    			attr_dev(li4, "data-speed", "2");
    			add_location(li4, file$7, 434, 14, 12723);
    			attr_dev(ul, "class", "speed-list svelte-1q4rf83");
    			add_location(ul, file$7, 429, 12, 12424);
    			attr_dev(div10, "class", "speed svelte-1q4rf83");
    			add_location(div10, file$7, 428, 10, 12392);
    			attr_dev(path4, "d", "M0 0V-1.5H-1.5V0H0ZM0 18H-1.5V19.5H0V18ZM26\n                18V19.5H27.5V18H26ZM26 0H27.5V-1.5H26V0ZM1.5\n                6.54545V0H-1.5V6.54545H1.5ZM0 1.5H10.1111V-1.5H0V1.5ZM-1.5\n                11.4545V18H1.5V11.4545H-1.5ZM0 19.5H10.1111V16.5H0V19.5ZM24.5\n                11.4545V18H27.5V11.4545H24.5ZM26 16.5H15.8889V19.5H26V16.5ZM27.5\n                6.54545V0H24.5V6.54545H27.5ZM26 -1.5H15.8889V1.5H26V-1.5Z");
    			attr_dev(path4, "transform", "translate(2 2)");
    			attr_dev(path4, "fill", "white");
    			attr_dev(path4, "class", "svelte-1q4rf83");
    			add_location(path4, file$7, 444, 14, 13031);
    			attr_dev(svg1, "width", "30");
    			attr_dev(svg1, "height", "22");
    			attr_dev(svg1, "viewBox", "0 0 30 22");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "class", "svelte-1q4rf83");
    			add_location(svg1, file$7, 438, 12, 12851);
    			attr_dev(div11, "class", "fullscreen svelte-1q4rf83");
    			add_location(div11, file$7, 437, 10, 12814);
    			attr_dev(div12, "class", "controls-right svelte-1q4rf83");
    			add_location(div12, file$7, 427, 8, 12353);
    			attr_dev(div13, "class", "controls-main svelte-1q4rf83");
    			add_location(div13, file$7, 376, 6, 10183);
    			attr_dev(div14, "class", "controls svelte-1q4rf83");
    			add_location(div14, file$7, 368, 4, 9960);
    			attr_dev(div15, "class", "player svelte-1q4rf83");
    			add_location(div15, file$7, 365, 2, 9844);
    			attr_dev(div16, "class", "player-container svelte-1q4rf83");
    			add_location(div16, file$7, 364, 0, 9811);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div15);
    			append_dev(div15, video);
    			append_dev(div15, t0);
    			append_dev(div15, div0);
    			append_dev(div15, t1);
    			append_dev(div15, div14);
    			append_dev(div14, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t2);
    			append_dev(div1, span1);
    			append_dev(div14, t3);
    			append_dev(div14, div3);
    			append_dev(div3, div2);
    			append_dev(div14, t4);
    			append_dev(div14, div13);
    			append_dev(div13, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div4);
    			append_dev(div4, svg0);
    			append_dev(svg0, path0);
    			append_dev(svg0, path1);
    			append_dev(svg0, path2);
    			append_dev(svg0, path3);
    			append_dev(div7, t5);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div13, t6);
    			append_dev(div13, div9);
    			append_dev(div13, t7);
    			append_dev(div13, div12);
    			append_dev(div12, div10);
    			append_dev(div10, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t9);
    			append_dev(ul, li1);
    			append_dev(ul, t11);
    			append_dev(ul, li2);
    			append_dev(ul, t13);
    			append_dev(ul, li3);
    			append_dev(ul, t15);
    			append_dev(ul, li4);
    			append_dev(div12, t17);
    			append_dev(div12, div11);
    			append_dev(div11, svg1);
    			append_dev(svg1, path4);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div16);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	onMount(() => {
    		//ELEMENT SELECTORS
    		var player = document.querySelector(".player");

    		var video = document.querySelector("#video");
    		var playBtn = document.querySelector(".play-btn");
    		var volumeBtn = document.querySelector(".volume-btn");
    		var volumeSlider = document.querySelector(".volume-slider");
    		var volumeFill = document.querySelector(".volume-filled");
    		var progressSlider = document.querySelector(".progress");
    		var progressFill = document.querySelector(".progress-filled");
    		var textCurrent = document.querySelector(".time-current");
    		var textTotal = document.querySelector(".time-total");
    		var speedBtns = document.querySelectorAll(".speed-item");
    		var fullscreenBtn = document.querySelector(".fullscreen");

    		//GLOBAL VARS
    		let lastVolume = 1;

    		let isMouseDown = false;

    		//PLAYER FUNCTIONS
    		function togglePlay() {
    			if (video.paused) {
    				video.play();
    			} else {
    				video.pause();
    			}

    			playBtn.classList.toggle("paused");
    		}

    		function togglePlayBtn() {
    			playBtn.classList.toggle("playing");
    		}

    		function toggleMute() {
    			if (video.volume) {
    				lastVolume = video.volume;
    				video.volume = 0;
    				volumeBtn.classList.add("muted");
    				volumeFill.style.width = 0;
    			} else {
    				video.volume = lastVolume;
    				volumeBtn.classList.remove("muted");
    				volumeFill.style.width = `${lastVolume * 100}%`;
    			}
    		}

    		function changeVolume(e) {
    			volumeBtn.classList.remove("muted");
    			let volume = e.offsetX / volumeSlider.offsetWidth;
    			volume < 0.1 ? volume = 0 : volume = volume;
    			volumeFill.style.width = `${volume * 100}%`;
    			video.volume = volume;

    			if (volume > 0.7) {
    				volumeBtn.classList.add("loud");
    			} else if (volume < 0.7 && volume > 0) {
    				volumeBtn.classList.remove("loud");
    			} else if (volume == 0) {
    				volumeBtn.classList.add("muted");
    			}

    			lastVolume = volume;
    		}

    		function neatTime(time) {
    			// var hours = Math.floor((time % 86400)/3600)
    			var minutes = Math.floor(time % 3600 / 60);

    			var seconds = Math.floor(time % 60);
    			seconds = seconds > 9 ? seconds : `0${seconds}`;
    			return `${minutes}:${seconds}`;
    		}

    		function updateProgress(e) {
    			progressFill.style.width = `${video.currentTime / video.duration * 100}%`;
    			textCurrent.innerHTML = `${neatTime(video.currentTime)} / ${neatTime(video.duration)}`;
    		} // textTotal.innerHTML = neatTime(video.duration);
    		// console.log(progressFill.style.width);

    		function setProgress(e) {
    			const newTime = e.offsetX / progressSlider.offsetWidth;
    			progressFill.style.width = `${newTime * 100}%`;
    			video.currentTime = newTime * video.duration;
    		}

    		function launchIntoFullscreen(element) {
    			if (element.requestFullscreen) {
    				element.requestFullscreen();
    			} else if (element.mozRequestFullScreen) {
    				element.mozRequestFullScreen();
    			} else if (element.webkitRequestFullscreen) {
    				element.webkitRequestFullscreen();
    			} else if (element.msRequestFullscreen) {
    				element.msRequestFullscreen();
    			}
    		}

    		function exitFullscreen() {
    			if (document.exitFullscreen) {
    				document.exitFullscreen();
    			} else if (document.mozCancelFullScreen) {
    				document.mozCancelFullScreen();
    			} else if (document.webkitExitFullscreen) {
    				document.webkitExitFullscreen();
    			}
    		}

    		var fullscreen = false;

    		function toggleFullscreen() {
    			fullscreen
    			? exitFullscreen()
    			: launchIntoFullscreen(player);

    			fullscreen = !fullscreen;
    		}

    		function setSpeed(e) {
    			//console.log(parseFloat(this.dataset.speed));
    			video.playbackRate = this.dataset.speed;

    			speedBtns.forEach(speedBtn => speedBtn.classList.remove("active"));
    			this.classList.add("active");
    		}

    		function handleKeypress(e) {
    			switch (e.key) {
    				case " ":
    					togglePlay();
    				case "ArrowRight":
    					video.currentTime += 5;
    				case "ArrowLeft":
    					video.currentTime -= 5;
    				default:
    					return;
    			}
    		}

    		//EVENT LISTENERS
    		playBtn.addEventListener("click", togglePlay);

    		video.addEventListener("click", togglePlay);
    		video.addEventListener("play", togglePlayBtn);
    		video.addEventListener("pause", togglePlayBtn);
    		video.addEventListener("ended", togglePlayBtn);
    		video.addEventListener("timeupdate", updateProgress);
    		video.addEventListener("canplay", updateProgress);
    		volumeBtn.addEventListener("click", toggleMute);
    		window.addEventListener("mousedown", () => isMouseDown = true);
    		window.addEventListener("mouseup", () => isMouseDown = false);

    		// volumeSlider.addEventListener('mouseover', changeVolume);
    		volumeSlider.addEventListener("click", changeVolume);

    		progressSlider.addEventListener("click", setProgress);
    		fullscreenBtn.addEventListener("click", toggleFullscreen);

    		speedBtns.forEach(speedBtn => {
    			speedBtn.addEventListener("click", setSpeed);
    		});

    		window.addEventListener("keydown", handleKeypress);
    	});

    	transcoded.subscribe(value => {
    		if (value) {
    			document.getElementById("video").src = value;
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Video> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Video", $$slots, []);
    	$$self.$capture_state = () => ({ onMount, transcoded });
    	return [];
    }

    class Video extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Video",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.23.0 */
    const file$8 = "src/App.svelte";

    // (68:2) {:else}
    function create_else_block(ctx) {
    	let t0;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let div0;
    	let div1_transition;
    	let t2;
    	let div2;
    	let current;
    	const headercontent = new Header({ $$inline: true });
    	const if_block_creators = [create_if_block_1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (!/*fileState*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const terminal = new Terminal_1({ $$inline: true });
    	const configure = new Configure({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(headercontent.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			if_block.c();
    			t1 = space();
    			div0 = element("div");
    			create_component(terminal.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(configure.$$.fragment);
    			attr_dev(div0, "class", "terminal-wrapper svelte-1t0d8m1");
    			add_location(div0, file$8, 81, 6, 1869);
    			attr_dev(div1, "class", "flex-wrapper svelte-1t0d8m1");
    			add_location(div1, file$8, 69, 4, 1481);
    			attr_dev(div2, "class", "configure-wrapper svelte-1t0d8m1");
    			add_location(div2, file$8, 85, 4, 1949);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headercontent, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(terminal, div0, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(configure, div2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, t1);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headercontent.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(terminal.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { y: 200, duration: 2000 }, true);
    				div1_transition.run(1);
    			});

    			transition_in(configure.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headercontent.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(terminal.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { y: 200, duration: 2000 }, false);
    			div1_transition.run(0);
    			transition_out(configure.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headercontent, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    			destroy_component(terminal);
    			if (detaching && div1_transition) div1_transition.end();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			destroy_component(configure);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(68:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (66:2) {#if loaded === false}
    function create_if_block(ctx) {
    	let current;
    	const loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(66:2) {#if loaded === false}",
    		ctx
    	});

    	return block;
    }

    // (75:6) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let div_transition;
    	let current;
    	const video = new Video({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(video.$$.fragment);
    			attr_dev(div, "class", "video-wrapper svelte-1t0d8m1");
    			add_location(div, file$8, 75, 8, 1711);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(video, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(video.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { delay: 2000, y: 200, duration: 2000 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(video.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { delay: 2000, y: 200, duration: 2000 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(video);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(75:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (71:6) {#if !fileState}
    function create_if_block_1(ctx) {
    	let div;
    	let div_outro;
    	let current;
    	const dropzone = new Dropzone_1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(dropzone.$$.fragment);
    			attr_dev(div, "class", "dropzone-wrapper svelte-1t0d8m1");
    			add_location(div, file$8, 71, 8, 1583);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(dropzone, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropzone.$$.fragment, local);
    			if (div_outro) div_outro.end(1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropzone.$$.fragment, local);
    			div_outro = create_out_transition(div, fly, { y: 200, duration: 2000 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(dropzone);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(71:6) {#if !fileState}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[0] === false) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "svelte-1t0d8m1");
    			add_location(main, file$8, 64, 0, 1398);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
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
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $loadedStore;
    	let $fileUploaded;
    	validate_store(loadedStore, "loadedStore");
    	component_subscribe($$self, loadedStore, $$value => $$invalidate(2, $loadedStore = $$value));
    	validate_store(fileUploaded, "fileUploaded");
    	component_subscribe($$self, fileUploaded, $$value => $$invalidate(3, $fileUploaded = $$value));
    	let loaded = $loadedStore;

    	loadedStore.subscribe(val => {
    		$$invalidate(0, loaded = val);
    	});

    	let fileState = $fileUploaded;
    	fileUploaded.subscribe(val => $$invalidate(1, fileState = val));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		writable,
    		fileUploaded,
    		terminalText,
    		loadedStore,
    		HeaderContent: Header,
    		Terminal: Terminal_1,
    		Dropzone: Dropzone_1,
    		Loader,
    		fly,
    		slide,
    		Configure,
    		Video,
    		loaded,
    		fileState,
    		$loadedStore,
    		$fileUploaded
    	});

    	$$self.$inject_state = $$props => {
    		if ("loaded" in $$props) $$invalidate(0, loaded = $$props.loaded);
    		if ("fileState" in $$props) $$invalidate(1, fileState = $$props.fileState);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loaded, fileState];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {
        name: "world",
        loaded: false,
      },
    });

    // define a new console
    let newConsole = function (oldCons) {
      return {
        log: function (text) {
          oldCons.log(text);
          terminalText.update((existing) => text);
        },
        info: function (text) {
          oldCons.info(text);
          // terminalText.update((existing) => text);
        },
        warn: function (text) {
          oldCons.warn(text);
          // Your code
        },
        error: function (text) {
          oldCons.error(text);
          // Your code
        },
      };
    };

    window.console = newConsole(window.console);

    return app;

}());
//# sourceMappingURL=bundle.js.map
